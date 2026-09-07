export interface PermissionDefinition {
  key: string;
  controller: string;
  method: string;
  httpMethod?: string;
  route?: string;
  sourceFile: string;
}

export interface RbacPrincipal {
  [key: string]: unknown;
}

export interface RbacModuleOptions {
  principalProperty?: string;
  permissionProperty?: string;
}

export interface RbacSqlClient {
  query<T = unknown>(sql: string, parameters?: unknown[]): Promise<T>;
}