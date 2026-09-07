import { PermissionDefinition } from "../domain/rbac.types";

export interface RbacPermissionRepository {
  replaceAll(definitions: PermissionDefinition[]): Promise<void>;
}