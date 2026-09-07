import { SetMetadata } from "@nestjs/common";
import { RBAC_PERMISSIONS_KEY } from "../domain/rbac.tokens";

export const Permissions = (...permissions: string[]) =>
  SetMetadata(RBAC_PERMISSIONS_KEY, permissions);