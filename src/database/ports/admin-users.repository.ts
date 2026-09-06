import { AdminUser } from "../domain/entities";

export abstract class AdminUsersRepository {
  abstract findByEmail(email: string): Promise<AdminUser | null>;
  abstract create(data: NewAdminUser): Promise<AdminUser>;
}

export interface NewAdminUser {
  email: string;
  passwordHash: string;
}