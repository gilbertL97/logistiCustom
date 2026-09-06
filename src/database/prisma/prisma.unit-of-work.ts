import { Inject, Injectable } from "@nestjs/common";
import { CodesRepository } from "../ports/codes.repository";
import { DevicesRepository } from "../ports/devices.repository";
import { LicensesRepository } from "../ports/licenses.repository";
import { AttemptsRepository } from "../ports/attempts.repository";
import { AdminUsersRepository } from "../ports/admin-users.repository";
import { UnitOfWork } from "../ports/unit-of-work";
import { PrismaCodesRepository, PrismaDevicesRepository, PrismaLicensesRepository, PrismaAttemptsRepository, PrismaAdminUsersRepository } from "./repositories";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class PrismaUnitOfWork extends UnitOfWork {
  constructor(@Inject(PrismaService) private prisma: PrismaService) { super(); }

  async run<T>(fn: (repos: {
    codes: CodesRepository;
    devices: DevicesRepository;
    licenses: LicensesRepository;
    attempts: AttemptsRepository;
    adminUsers: AdminUsersRepository;
  }) => Promise<T>): Promise<T> {
    return this.prisma.$transaction(async (tx) => {
      const repos = {
        codes: new PrismaCodesRepository(tx),
        devices: new PrismaDevicesRepository(tx),
        licenses: new PrismaLicensesRepository(tx),
        attempts: new PrismaAttemptsRepository(tx),
        adminUsers: new PrismaAdminUsersRepository(tx),
      };
      return fn(repos);
    });
  }
}