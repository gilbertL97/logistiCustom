import { Device } from "../../database/domain/entities";
import { Code } from "../../database/domain/entities";
import { License } from "../../database/domain/entities";
import { Attempt } from "../../database/domain/entities";
import { AdminUser } from "../../database/domain/entities";

export abstract class CodesRepository {
  abstract findByCode(code: string): Promise<Code | null>;
  abstract findUsedByDevice(deviceId: string): Promise<Code | null>;
  abstract markAsUsed(code: string, deviceId: string): Promise<Code>;
  abstract incrementUses(code: string): Promise<Code>;
}

export abstract class DevicesRepository {
  abstract findByFingerprint(fingerprint: string): Promise<Device | null>;
  abstract create(data: NewDevice): Promise<Device>;
  abstract renewTrial(id: string, newEndsAt: Date): Promise<Device>;
  abstract setStatus(id: string, status: Device['status']): Promise<void>;
}

export abstract class LicensesRepository {
  abstract create(data: NewLicense): Promise<License>;
  abstract findByDevice(deviceId: string): Promise<License[]>;
  abstract findActiveByDevice(deviceId: string): Promise<License | null>;
  abstract revoke(id: string): Promise<void>;
}

export abstract class AttemptsRepository {
  abstract create(data: NewAttempt): Promise<Attempt>;
  abstract findFailedByDevice(deviceId: string, limit?: number): Promise<Attempt[]>;
}

export abstract class AdminUsersRepository {
  abstract findByEmail(email: string): Promise<AdminUser | null>;
  abstract create(data: NewAdminUser): Promise<AdminUser>;
}

export interface NewAdminUser {
  email: string;
  passwordHash: string;
}

export abstract class UnitOfWork {
  abstract run<T>(fn: (repos: {
    codes: CodesRepository;
    devices: DevicesRepository;
    licenses: LicensesRepository;
    attempts: AttemptsRepository;
    adminUsers: AdminUsersRepository;
  }) => Promise<T>): Promise<T>;
}

export interface NewDevice {
  fingerprint: string;
  installId: string;
  platform: string;
  appVersion: string;
  trialDays?: number;
}

export interface NewLicense {
  deviceId: string;
}

export interface NewAttempt {
  deviceId?: string;
  codeTried: string;
  ip: string;
  userAgent: string;
  success: boolean;
}