import { Injectable } from "@nestjs/common";
import { normalizeFingerprint } from "../../common/utils/fingerprint.util";

@Injectable()
export class DeviceFingerprintService {
  normalize(signals: {
    androidId?: string;
    model?: string;
    sdkVersion?: number;
    manufacturer?: string;
    brand?: string;
  }): string {
    return normalizeFingerprint(signals);
  }
}