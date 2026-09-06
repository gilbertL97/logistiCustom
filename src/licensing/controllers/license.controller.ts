import { Controller, Get } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { LicenseResponseDto } from "../dto/license-response.dto";

@ApiTags("licensing")
@Controller("api/v1/license")
export class LicenseController {
  @Get()
  async getLicense(@Request() req: any) {
    const device = req.device;
    if (!device) {
      return { status: "EXPIRED", trialEndsAt: new Date(), token: "", deviceId: "" };
    }

    const token = `jwt.${device.id}.exp.${new Date(Date.now() + 12 * 60 * 60 * 1000).getTime()}`;
    return {
      token,
      deviceId: device.id,
      trialEndsAt: device.trialEndsAt,
      serverTime: new Date(),
    };
  }
}