import { Attempt } from "../domain/entities";
import { NewAttempt } from "./codes.repository";

export abstract class AttemptsRepository {
  abstract create(data: NewAttempt): Promise<Attempt>;
  abstract findFailedByDevice(deviceId: string, limit?: number): Promise<Attempt[]>;
}