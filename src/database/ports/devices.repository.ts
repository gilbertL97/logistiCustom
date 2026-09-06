import { Device } from "../../domain/entities";

export interface DevicesRepository {
  findByFingerprint(fingerprint: string): Promise<Device | null>;
  create(data: NewDevice): Promise<Device>;
  renewTrial(id: string, newEndsAt: Date): Promise<Device>;
  setStatus(id: string, status: Device['status']): Promise<void>;
}

export interface NewDevice {
  fingerprint: string;
  installId: string;
  platform: string;
  appVersion: string;
  trialDays?: number;
}