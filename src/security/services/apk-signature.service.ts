import { Injectable } from "@nestjs/common";

@Injectable()
export class ApkSignatureService {
  verify(signature: string | undefined, _payload: string): boolean {
    return Boolean(signature);
  }
}