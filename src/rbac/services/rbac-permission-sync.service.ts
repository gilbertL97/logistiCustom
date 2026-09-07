import { Inject, Injectable } from "@nestjs/common";
import { RBAC_PERMISSION_REPOSITORY } from "../domain/rbac.tokens";
import { PermissionDefinition } from "../domain/rbac.types";
import { RbacPermissionRepository } from "../ports/rbac-permission.repository";
import { ControllerPermissionScannerService } from "./controller-permission-scanner.service";

@Injectable()
export class RbacPermissionSyncService {
  constructor(
    private readonly scanner: ControllerPermissionScannerService,
    @Inject(RBAC_PERMISSION_REPOSITORY) private readonly repository: RbacPermissionRepository,
  ) {}

  async scanAndPersist(root: string): Promise<PermissionDefinition[]> {
    const definitions = await this.scanner.scan(root);
    await this.repository.replaceAll(definitions);
    return definitions;
  }
}