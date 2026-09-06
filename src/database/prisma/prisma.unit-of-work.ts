import { Inject, Injectable } from "@nestjs/common";
import { UnitOfWork } from "../ports/unit-of-work";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class PrismaUnitOfWork implements UnitOfWork {
  constructor(@Inject(PrismaService) private prisma: PrismaService) {}

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