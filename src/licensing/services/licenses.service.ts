import { Injectable, Logger } from "@nestjs/common";
import { CodesRepository } from "../../database/ports/codes.repository";
import { DevicesRepository } from "../../database/ports/devices.repository";
import { LicensesRepository } from "../../database/ports/licenses.repository";
import { AttemptsRepository } from "../../database/ports/attempts.repository";
import { UnitOfWork } from "../../database/ports/unit-of-work";
import { ActivateRequestDto } from "../dto/activate-request.dto";
import { LicenseResponseDto } from "../dto/license-response.dto";
import { Device } from "../../database/domain/entities";
import { CodeInvalidException, CodeAlreadyUsedException, DeviceAlreadyTrialedException, UnexpectedErrorException } from "../../errors/custom-exception";

@Injectable()
export class LicensesService {
  private readonly logger = new Logger(LicensesService.name);

  constructor(
    private codesRepository: CodesRepository,
    private devicesRepository: DevicesRepository,
    private licensesRepository: LicensesRepository,
    private attemptsRepository: AttemptsRepository,
    private uow: UnitOfWork,
  ) {}

  async activate(
    dto: ActivateRequestDto,
    ip: string,
    userAgent: string,
  ): Promise<LicenseResponseDto> {
    const code = await this.codesRepository.findByCode(dto.code);
    if (!code) {
      await this.attemptsRepository.create({
        codeTried: dto.code,
        ip,
        userAgent,
        success: false,
      });
      throw new CodeInvalidException();
    }

    if (code.usedAt !== null) {
      await this.attemptsRepository.create({
        codeTried: dto.code,
        ip,
        userAgent,
        success: false,
      });
      throw new CodeAlreadyUsedException();
    }

    const device = await this.devicesRepository.findByFingerprint(dto.fingerprint);
    const now = new Date();

    if (device) {
      if (device.status === "ACTIVE" && now < device.trialEndsAt) {
        await this.attemptsRepository.create({
          codeTried: dto.code,
          ip,
          userAgent,
          success: false,
        });
        throw new DeviceAlreadyTrialedException();
      }

      if (device.status === "ACTIVE" && now >= device.trialEndsAt) {
        const newEndsAt = new Date(
          Math.max(device.trialEndsAt.getTime(), now.getTime()) + 7 * 24 * 60 * 60 * 1000,
        );
        const renewedDevice = await this.devicesRepository.renewTrial(
          device.id,
          newEndsAt,
        );
        const license = await this.licensesRepository.create({
          deviceId: renewedDevice.id,
        });
        await this.attemptsRepository.create({
          codeTried: dto.code,
          ip,
          userAgent,
          success: true,
        });
        return new LicenseResponseDto(
          `jwt.${renewedDevice.id}.exp.${newEndsAt.getTime()}`,
          renewedDevice.id,
          renewedDevice.trialEndsAt,
          now,
        );
      }

      if (device.status === "EXPIRED") {
        const newEndsAt = new Date(
          Math.max(device.trialEndsAt.getTime(), now.getTime()) + 7 * 24 * 60 * 60 * 1000,
        );
        const renewedDevice = await this.devicesRepository.renewTrial(
          device.id,
          newEndsAt,
        );
        const license = await this.licensesRepository.create({
          deviceId: renewedDevice.id,
        });
        await this.attemptsRepository.create({
          codeTried: dto.code,
          ip,
          userAgent,
          success: true,
        });
        return new LicenseResponseDto(
          `jwt.${renewedDevice.id}.exp.${newEndsAt.getTime()}`,
          renewedDevice.id,
          renewedDevice.trialEndsAt,
          now,
        );
      }
    } else {
      const trialEndsAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      const newDevice = await this.devicesRepository.create({
        fingerprint: dto.fingerprint,
        installId: dto.installId,
        platform: dto.platform || "android",
        appVersion: dto.appVersion || "1.0.0",
      });

      await this.codesRepository.markAsUsed(dto.code, newDevice.id);
      await this.licensesRepository.create({
        deviceId: newDevice.id,
      });
      await this.attemptsRepository.create({
        codeTried: dto.code,
        ip,
        userAgent,
        success: true,
      });

      return new LicenseResponseDto(
        `jwt.${newDevice.id}.exp.${trialEndsAt.getTime()}`,
        newDevice.id,
        trialEndsAt,
        now,
      );
    }

    throw new UnexpectedErrorException("LicensesService.activate");
  }

  async renew(
    deviceId: string,
    days: number,
  ): Promise<LicenseResponseDto> {
    const newEndsAt = new Date(
      Math.max(0, new Date().getTime()) + days * 24 * 60 * 60 * 1000,
    );

    const renewedDevice = await this.devicesRepository.renewTrial(deviceId, newEndsAt);
    await this.licensesRepository.create({ deviceId: renewedDevice.id });
    return new LicenseResponseDto(
      `jwt.${renewedDevice.id}.exp.${newEndsAt.getTime()}`,
      renewedDevice.id,
      renewedDevice.trialEndsAt,
      new Date(),
    );
  }

  recordAttempt(
    codeTried: string,
    ip: string,
    userAgent: string,
    success: boolean,
    deviceId?: string,
  ): Promise<void> {
    return this.attemptsRepository.create({
      codeTried,
      ip,
      userAgent,
      success,
      deviceId,
    }).then(() => undefined);
  }
}