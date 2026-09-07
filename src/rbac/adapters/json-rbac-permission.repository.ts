import { mkdir, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import { PermissionDefinition } from "../domain/rbac.types";
import { RbacPermissionRepository } from "../ports/rbac-permission.repository";

export class JsonRbacPermissionRepository implements RbacPermissionRepository {
  constructor(private readonly filePath: string) {}

  async replaceAll(definitions: PermissionDefinition[]): Promise<void> {
    await mkdir(dirname(this.filePath), { recursive: true });
    await writeFile(this.filePath, JSON.stringify(definitions, null, 2), "utf8");
  }
}