import { Module } from "@nestjs/common";
import { CodesRepositoryPort } from "../ports/codes.repository";
import { DevicesRepositoryPort } from "../ports/devices.repository";
import { LicensesRepositoryPort } from "../ports/licenses.repository";
import { AttemptsRepositoryPort } from "../ports/attempts.repository";
import { AdminUsersRepositoryPort } from "../ports/admin-users.repository";
import { UnitOfWorkPort } from "../ports/unit-of-work";

import { PrismaRepositoriesModule } from "./prisma/prisma.repositories.module";
import { DrizzleRepositoriesModule } from "./drizzle/drizzle.repositories.module";
import { TypeOrmRepositoriesModule } from "./typeorm/typeorm.repositories.module";

const driverMap = {
  prisma: PrismaRepositoriesModule,
  drizzle: DrizzleRepositoriesModule,
  typeorm: TypeOrmRepositoriesModule,
};

@Module({
  imports: [],
  exports: [
    CodesRepositoryPort,
    DevicesRepositoryPort,
    LicensesRepositoryPort,
    AttemptsRepositoryPort,
    AdminUsersRepositoryPort,
    UnitOfWorkPort,
  ],
})
export class DatabaseModule {
  static forRoot(driver: string = "prisma") {
    const module = driverMap[driver] || PrismaRepositoriesModule;
    return {
      module,
      exports: [
        CodesRepositoryPort,
        DevicesRepositoryPort,
        LicensesRepositoryPort,
        AttemptsRepositoryPort,
        AdminUsersRepositoryPort,
        UnitOfWorkPort,
      ],
    };
  }
}