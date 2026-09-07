import { Injectable } from "@nestjs/common";
import { readFile } from "node:fs/promises";
import { readdir } from "node:fs/promises";
import { join, relative } from "node:path";
import { PermissionDefinition } from "../domain/rbac.types";

@Injectable()
export class ControllerPermissionScannerService {
  async scan(root: string): Promise<PermissionDefinition[]> {
    const files = await this.tsFiles(root);
    const definitions: PermissionDefinition[] = [];
    for (const file of files) definitions.push(...await this.scanFile(file, root));
    return definitions;
  }

  private async scanFile(file: string, root: string): Promise<PermissionDefinition[]> {
    const source = await readFile(file, "utf8");
    const controller = source.match(/@Controller\(\s*["'`]([^"'`]*)["'`]\s*\)[\s\S]*?class\s+(\w+)/);
    if (!controller) return [];
    const classStart = source.indexOf(`class ${controller[2]}`);
    const classBody = source.slice(classStart);
    const results: PermissionDefinition[] = [];
    const methodPattern = /((?:@\w+(?:\([^\n]*\))?\s*)+)\s*(?:async\s+)?(\w+)\s*\(/g;
    let match: RegExpExecArray | null;
    while ((match = methodPattern.exec(classBody)) !== null) {
      const permissions = this.metadata(match[1], "Permissions");
      if (permissions.length === 0) continue;
      const route = this.routeMetadata(match[1]);
      results.push(...permissions.map((key) => ({
        key, controller: controller[2], method: match![2], route: route.route,
        httpMethod: route.httpMethod, sourceFile: relative(root, file),
      })));
    }
    return results;
  }

  private metadata(block: string, decorator: string): string[] {
    const match = block.match(new RegExp(`@${decorator}\\(([^)]*)\\)`));
    return match ? [...match[1].matchAll(/["'`]([^"'`]+)["'`]/g)].map((item) => item[1]) : [];
  }

  private routeMetadata(block: string): { httpMethod?: string; route?: string } {
    const match = block.match(/@(Get|Post|Put|Patch|Delete|Options|Head)\(\s*["'`]([^"'`]*)["'`]\s*\)/);
    return match ? { httpMethod: match[1].toUpperCase(), route: match[2] } : {};
  }

  private async tsFiles(root: string): Promise<string[]> {
    const entries = await readdir(root, { withFileTypes: true });
    const files: string[] = [];
    for (const entry of entries) {
      if (["node_modules", "dist", ".git"].includes(entry.name)) continue;
      const path = join(root, entry.name);
      if (entry.isDirectory()) files.push(...await this.tsFiles(path));
      else if (/\.controller\.ts$/.test(entry.name)) files.push(path);
    }
    return files;
  }
}