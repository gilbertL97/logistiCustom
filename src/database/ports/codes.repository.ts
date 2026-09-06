import { Device } from "../../database/domain/entities";
import { Code } from "../../database/domain/entities";
import { License } from "../../database/domain/entities";
import { Attempt } from "../../database/domain/entities";
import { AdminUser } from "../../database/domain/entities";

export interface CodesRepository {
  findByCode(code: string): Promise<Code | null>;
  findUsedByDevice(deviceId: string): Promise<Code | null>;
  markAsUsed(code: string, deviceId: string): Promise<Code>;
  incrementUses(code: string): Promise<Code>;
}

export interface DevicesRepository {
  findByFingerprint(fingerprint: string): Promise<Device | null>;
  create(data: NewDevice): Promise<Device>;
  renewTrial(id: string, newEndsAt: Date): Promise<Device>;
  setStatus(id: string, status: Device['status']): Promise<void>;
}

export interface LicensesRepository {
  create(data: NewLicense): Promise<License>;
  findByDevice(deviceId: string): Promise<License[]>;
  findActiveByDevice(deviceId: string): Promise<License | null>;
  revoke(id: string): Promise<void>;
}

export interface AttemptsRepository {
  create(data: NewAttempt): Promise<Attempt>;
  findFailedByDevice(deviceId: string, limit?: number): Promise<Attempt[]>;
}

export interface AdminUsersRepository {
  findByEmail(email: string): Promise<AdminUser | null>;
  create(data: NewAdminUser): Promise<AdminUser>;
}

export interface UnitOfWork {
  run<T>(fn: (repos: {
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