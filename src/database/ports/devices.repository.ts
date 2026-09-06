import { Device } from "../domain/entities";

export abstract class DevicesRepository {
  abstract findByFingerprint(fingerprint: string): Promise<Device | null>;
  abstract create(data: NewDevice): Promise<Device>;
  abstract renewTrial(id: string, newEndsAt: Date): Promise<Device>;
  abstract setStatus(id: string, status: Device['status']): Promise<void>;
}

export interface NewDevice {
  fingerprint: string;
  installId: string;
  platform: string;
  appVersion: string;
  trialDays?: number;
}