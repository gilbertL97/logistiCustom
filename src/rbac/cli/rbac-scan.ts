import { resolve } from "node:path";
import { ControllerPermissionScannerService } from "../services/controller-permission-scanner.service";
import { JsonRbacPermissionRepository } from "../adapters/json-rbac-permission.repository";

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const argument = (name: string, fallback: string): string => {
    const flag = args.find((value) => value === name || value.startsWith(`${name}=`));
    if (!flag) return fallback;
    if (flag.includes("=")) return flag.slice(flag.indexOf("=") + 1);
    return args[args.indexOf(flag) + 1] || fallback;
  };
  const positional = args.filter((value, index) => {
    if (value.startsWith("--")) return false;
    const previous = args[index - 1];
    return previous !== "--root" && previous !== "--output";
  });
  const root = resolve(argument("--root", positional[0] || "src"));
  const output = resolve(argument("--output", positional[1] || ".rbac/permissions.json"));
  const scanner = new ControllerPermissionScannerService();
  const definitions = await scanner.scan(root);
  await new JsonRbacPermissionRepository(output).replaceAll(definitions);
  console.log(`RBAC: ${definitions.length} permisos guardados en ${output}`);
}

main().catch((error: unknown) => {
  console.error("RBAC scan failed", error);
  process.exitCode = 1;
});