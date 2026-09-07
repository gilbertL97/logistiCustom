import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Inject,
  Injectable,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { RBAC_OPTIONS, RBAC_PERMISSIONS_KEY } from "../domain/rbac.tokens";
import { RbacModuleOptions } from "../domain/rbac.types";

@Injectable()
export class RbacGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    @Inject(RBAC_OPTIONS) private readonly options: RbacModuleOptions,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(RBAC_PERMISSIONS_KEY, [
      context.getHandler(), context.getClass(),
    ]) ?? [];
    if (requiredPermissions.length === 0) return true;

    const request = context.switchToHttp().getRequest<Record<string, unknown>>();
    const principal = request[this.options.principalProperty ?? "user"] as Record<string, unknown> | undefined;
    if (!principal) throw new ForbiddenException("Principal no encontrado");

    const permissions = this.values(principal[this.options.permissionProperty ?? "permissions"]);
    if (!requiredPermissions.every((permission) => permissions.includes(permission))) {
      throw new ForbiddenException("Permisos insuficientes");
    }
    return true;
  }

  private values(value: unknown): string[] {
    return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") :
      typeof value === "string" ? [value] : [];
  }
}