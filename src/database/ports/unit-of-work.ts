import { CodesRepository } from "./codes.repository";
import { DevicesRepository } from "./devices.repository";
import { LicensesRepository } from "./licenses.repository";
import { AttemptsRepository } from "./attempts.repository";
import { AdminUsersRepository } from "./admin-users.repository";

export abstract class UnitOfWork {
  abstract run<T>(fn: (repos: {
    codes: CodesRepository;
    devices: DevicesRepository;
    licenses: LicensesRepository;
    attempts: AttemptsRepository;
    adminUsers: AdminUsersRepository;
  }) => Promise<T>): Promise<T>;
}