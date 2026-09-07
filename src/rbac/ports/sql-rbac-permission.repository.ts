import { PermissionDefinition, RbacSqlClient } from "../domain/rbac.types";
import { RbacPermissionRepository } from "./rbac-permission.repository";

export class SqlRbacPermissionRepository implements RbacPermissionRepository {
  constructor(private readonly client: RbacSqlClient) {}

  async replaceAll(definitions: PermissionDefinition[]): Promise<void> {
    await this.client.query(
      `CREATE TABLE IF NOT EXISTS rbac_permissions (
        permission_key VARCHAR(190) PRIMARY KEY,
        controller VARCHAR(190) NOT NULL,
        method VARCHAR(190) NOT NULL,
        http_method VARCHAR(16),
        route VARCHAR(500),
        source_file VARCHAR(500) NOT NULL,
        updated_at TIMESTAMP NOT NULL
      )`,
    );
    await this.client.query("DELETE FROM rbac_permissions");

    for (const definition of definitions) {
      await this.client.query(
        `INSERT INTO rbac_permissions
          (permission_key, controller, method, http_method, route, source_file, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`,
        [
          definition.key,
          definition.controller,
          definition.method,
          definition.httpMethod ?? null,
          definition.route ?? null,
          definition.sourceFile,
        ],
      );
    }
  }
}