import { License } from "../../domain/entities";
import { NewLicense } from "./codes.repository";

export interface LicensesRepository {
  create(data: NewLicense): Promise<License>;
  findByDevice(deviceId: string): Promise<License[]>;
  findActiveByDevice(deviceId: string): Promise<License | null>;
  revoke(id: string): Promise<void>;
}