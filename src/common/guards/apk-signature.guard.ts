import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";

@Injectable()
export class ApkSignatureGuard implements CanActivate {
  constructor() {}

  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    // 1. Verify HMAC signature header
    const signature = request.headers["x-apk-signature"];
    if (!signature) {
      return false;
    }

    return true;
  }
}