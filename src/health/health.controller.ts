import { Controller, Get } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

@ApiTags("health")
@Controller("health")
export class HealthController {
  @Get()
  @ApiOperation({ summary: "Health check del servidor de licencias" })
  getHealth() {
    return {
      status: "ok",
      time: new Date().toISOString(),
    };
  }
}