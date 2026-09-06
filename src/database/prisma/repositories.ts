import {
  AdminUser,
  Attempt,
  Code,
  Device,
  License,
} from "../domain/entities";
import {
  AdminUsersRepository,
  NewAdminUser,
} from "../ports/admin-users.repository";
import { AttemptsRepository } from "../ports/attempts.repository";
import { CodesRepository, NewAttempt, NewLicense } from "../ports/codes.repository";
import { DevicesRepository, NewDevice } from "../ports/devices.repository";
import { LicensesRepository } from "../ports/licenses.repository";

type PrismaClientLike = any;

export class PrismaCodesRepository extends CodesRepository {
  constructor(private readonly prisma: PrismaClientLike) { super(); }

  findByCode(code: string): Promise<Code | null> {
    return this.prisma.code.findUnique({ where: { code } });
  }

  findUsedByDevice(deviceId: string): Promise<Code | null> {
    return this.prisma.code.findUnique({ where: { usedByDeviceId: deviceId } });
  }

  markAsUsed(code: string, deviceId: string): Promise<Code> {
    return this.prisma.code.update({
      where: { code },
      data: { usedAt: new Date(), usedByDeviceId: deviceId },
    });
  }

  incrementUses(code: string): Promise<Code> {
    return this.prisma.code.update({ where: { code }, data: { maxUses: { increment: 1 } } });
  }
}

export class PrismaDevicesRepository extends DevicesRepository {
  constructor(private readonly prisma: PrismaClientLike) { super(); }

  findByFingerprint(fingerprint: string): Promise<Device | null> {
    return this.prisma.device.findUnique({ where: { fingerprint } });
  }

  create(data: NewDevice): Promise<Device> {
    const trialEndsAt = new Date(Date.now() + (data.trialDays ?? 7) * 86400000);
    return this.prisma.device.create({ data: { ...data, trialEndsAt, trialDays: data.trialDays ?? 7 } });
  }

  renewTrial(id: string, newEndsAt: Date): Promise<Device> {
    return this.prisma.device.update({ where: { id }, data: { trialEndsAt: newEndsAt, status: "ACTIVE", renewals: { increment: 1 } } });
  }

  async setStatus(id: string, status: Device["status"]): Promise<void> {
    await this.prisma.device.update({ where: { id }, data: { status } });
  }
}

export class PrismaLicensesRepository extends LicensesRepository {
  constructor(private readonly prisma: PrismaClientLike) { super(); }

  create(data: NewLicense): Promise<License> {
    return this.prisma.license.create({ data: { ...data, expiresAt: new Date(Date.now() + 7 * 86400000) } });
  }

  findByDevice(deviceId: string): Promise<License[]> {
    return this.prisma.license.findMany({ where: { deviceId } });
  }

  findActiveByDevice(deviceId: string): Promise<License | null> {
    return this.prisma.license.findFirst({ where: { deviceId, revokedAt: null, expiresAt: { gt: new Date() } } });
  }

  async revoke(id: string): Promise<void> {
    await this.prisma.license.update({ where: { id }, data: { revokedAt: new Date() } });
  }
}

export class PrismaAttemptsRepository extends AttemptsRepository {
  constructor(private readonly prisma: PrismaClientLike) { super(); }

  async create(data: NewAttempt): Promise<Attempt> {
    return this.prisma.attempt.create({ data });
  }

  findFailedByDevice(deviceId: string, limit = 10): Promise<Attempt[]> {
    return this.prisma.attempt.findMany({ where: { deviceId, success: false }, take: limit, orderBy: { createdAt: "desc" } });
  }
}

export class PrismaAdminUsersRepository extends AdminUsersRepository {
  constructor(private readonly prisma: PrismaClientLike) { super(); }

  findByEmail(email: string): Promise<AdminUser | null> {
    return this.prisma.adminUser.findUnique({ where: { email } });
  }

  create(data: NewAdminUser): Promise<AdminUser> {
    return this.prisma.adminUser.create({ data });
  }
}