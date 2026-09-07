import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, UseGuards } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { DevicesRepository } from "../../database/ports/devices.repository";
import { AdminJwtAuthGuard } from "../../common/guards/admin-jwt-auth.guard";
import { Permissions } from "../../rbac/decorators/permissions.decorator";
import { RbacGuard } from "../../rbac/guards/rbac.guard";

@ApiTags("admin")
@Controller("api/v1/admin/devices")
@UseGuards(AdminJwtAuthGuard, RbacGuard)
export class DevicesController {
  constructor(private readonly devicesRepository: DevicesRepository) {}

  @Get()
  @Permissions("devices:read")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Listar dispositivos y su estado" })
  async list() {
    // In a real implementation, would query the repository
    return [];
  }

  @Post(":id/revoke")
  @Permissions("devices:revoke")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Revocar trial de un dispositivo" })
  async revoke(@Param("id") id: string) {
    await this.devicesRepository.setStatus(id, "REVOKED");
    return { message: "Dispositivo revocado" };
  }

  @Post(":id/extend")
  @Permissions("devices:extend")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Extender trial de un dispositivo" })
  async extend(@Param("id") id: string, @Body() body: { days: number }) {
    await this.devicesRepository.renewTrial(id, new Date(Date.now() + body.days * 24 * 60 * 60 * 1000));
    return { message: "Trial extendido" };
  }
}