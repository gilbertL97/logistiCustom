import { Module } from "@nestjs/common";
import { PrismaService } from "./prisma.service";
import { PrismaUnitOfWork } from "./prisma.unit-of-work";
import { PrismaCodesRepository, PrismaDevicesRepository, PrismaLicensesRepository, PrismaAttemptsRepository, PrismaAdminUsersRepository } from "./repositories";
import { CodesRepository } from "../ports/codes.repository";
import { DevicesRepository } from "../ports/devices.repository";
import { LicensesRepository } from "../ports/licenses.repository";
import { AttemptsRepository } from "../ports/attempts.repository";
import { AdminUsersRepository } from "../ports/admin-users.repository";
import { UnitOfWork } from "../ports/unit-of-work";

@Module({
  providers: [PrismaService, PrismaCodesRepository, PrismaDevicesRepository, PrismaLicensesRepository, PrismaAttemptsRepository, PrismaAdminUsersRepository, PrismaUnitOfWork,
    { provide: CodesRepository, useExisting: PrismaCodesRepository },
    { provide: DevicesRepository, useExisting: PrismaDevicesRepository },
    { provide: LicensesRepository, useExisting: PrismaLicensesRepository },
    { provide: AttemptsRepository, useExisting: PrismaAttemptsRepository },
    { provide: AdminUsersRepository, useExisting: PrismaAdminUsersRepository },
    { provide: UnitOfWork, useExisting: PrismaUnitOfWork },
  ],
  exports: [PrismaService, CodesRepository, DevicesRepository, LicensesRepository, AttemptsRepository, AdminUsersRepository, UnitOfWork],
})
export class PrismaRepositoriesModule {}