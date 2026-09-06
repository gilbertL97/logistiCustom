import { Module } from "@nestjs/common";
import { ApkSignatureService } from "./services/apk-signature.service";
import { RequestIdMiddleware } from "./middleware/request-id.middleware";

@Module({
  providers: [ApkSignatureService],
  exports: [ApkSignatureService],
})
export class SecurityModule {}