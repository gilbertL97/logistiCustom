import { AdminUser } from "../../domain/entities";

export interface AdminUsersRepository {
  findByEmail(email: string): Promise<AdminUser | null>;
  create(data: NewAdminUser): Promise<AdminUser>;
}

export interface NewAdminUser {
  email: string;
  passwordHash: string;
}