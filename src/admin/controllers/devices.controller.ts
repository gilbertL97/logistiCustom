import { Controller, Get, Param, Post, Body, HttpCode, HttpStatus } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { DevicesRepository } from "../../database/ports/devices.repository";

@ApiTags("admin")
@Controller("api/v1/admin/devices")
export class DevicesController {
  constructor(private readonly devicesRepository: DevicesRepository) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Listar dispositivos y su estado" })
  async list() {
    // In a real implementation, would query the repository
    return [];
  }

  @Post(":id/revoke")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Revocar trial de un dispositivo" })
  async revoke(@Param("id") id: string) {
    await this.devicesRepository.setStatus(id, "REVOKED");
    return { message: "Dispositivo revocado" };
  }

  @Post(":id/extend")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Extender trial de un dispositivo" })
  async extend(@Param("id") id: string, @Body() body: { days: number }) {
    await this.devicesRepository.renewTrial(id, new Date(Date.now() + body.days * 24 * 60 * 60 * 1000));
    return { message: "Trial extendido" };
  }
}