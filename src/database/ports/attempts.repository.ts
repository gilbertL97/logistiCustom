import { Attempt } from "../../domain/entities";
import { NewAttempt } from "./codes.repository";

export interface AttemptsRepository {
  create(data: NewAttempt): Promise<Attempt>;
  findFailedByDevice(deviceId: string, limit?: number): Promise<Attempt[]>;
}