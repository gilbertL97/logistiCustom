import { Module } from "@nestjs/common";
import { PrismaService } from "./prisma.service";
import { PrismaCodesRepository } from "../ports/codes.repository";
import { PrismaDevicesRepository } from "../ports/devices.repository";
import { PrismaLicensesRepository } from "../ports/licenses.repository";
import { PrismaAttemptsRepository } from "../ports/attempts.repository";
import { PrismaAdminUsersRepository } from "../ports/admin-users.repository";
import { UnitOfWork } from "../ports/unit-of-work";

@Module({
  providers: [PrismaService, UnitOfWork],
  exports: [PrismaService, UnitOfWork],
})
export class PrismaRepositoriesModule {}