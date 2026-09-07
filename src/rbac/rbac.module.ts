import { DynamicModule, Module } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JsonRbacPermissionRepository } from "./adapters/json-rbac-permission.repository";
import { RBAC_OPTIONS, RBAC_PERMISSION_REPOSITORY } from "./domain/rbac.tokens";
import { RbacModuleOptions } from "./domain/rbac.types";
import { RbacGuard } from "./guards/rbac.guard";
import { RbacPermissionRepository } from "./ports/rbac-permission.repository";
import { ControllerPermissionScannerService } from "./services/controller-permission-scanner.service";
import { RbacPermissionSyncService } from "./services/rbac-permission-sync.service";

@Module({})
export class RbacModule {
  static forRoot(options: RbacModuleOptions & { repository?: RbacPermissionRepository } = {}): DynamicModule {
    const repository = options.repository ?? new JsonRbacPermissionRepository(".rbac/permissions.json");
    return {
      module: RbacModule,
      providers: [
        Reflector,
        { provide: RBAC_OPTIONS, useValue: options },
        { provide: RBAC_PERMISSION_REPOSITORY, useValue: repository },
        RbacGuard, ControllerPermissionScannerService, RbacPermissionSyncService,
      ],
      exports: [RbacGuard, RbacPermissionSyncService, ControllerPermissionScannerService],
    };
  }
}