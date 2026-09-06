import { License } from "../domain/entities";
import { NewLicense } from "./codes.repository";

export abstract class LicensesRepository {
  abstract create(data: NewLicense): Promise<License>;
  abstract findByDevice(deviceId: string): Promise<License[]>;
  abstract findActiveByDevice(deviceId: string): Promise<License | null>;
  abstract revoke(id: string): Promise<void>;
}