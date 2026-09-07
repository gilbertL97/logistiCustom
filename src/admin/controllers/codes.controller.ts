import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { CodesRepository } from "../../database/ports/codes.repository";
import { AdminJwtAuthGuard } from "../../common/guards/admin-jwt-auth.guard";
import { Permissions } from "../../rbac/decorators/permissions.decorator";
import { RbacGuard } from "../../rbac/guards/rbac.guard";

@ApiTags("admin")
@Controller("api/v1/admin/codes")
@UseGuards(AdminJwtAuthGuard, RbacGuard)
export class CodesController {
  constructor(private readonly codesRepository: CodesRepository) {}

  @Post()
  @Permissions("codes:create")
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Generar códigos de prueba (bulk)" })
  async generate(@Body() body: { count: number; days?: number }) {
    const { count, days = 7 } = body;
    const codes = [];
    for (let i = 0; i < count; i++) {
      const code = `TEST-${Math.random().toString(36).substring(2).toUpperCase().substring(0, 8)}-${Math.random().toString(36).substring(2).toUpperCase().substring(0, 4)}-${Math.random().toString(36).substring(2).toUpperCase().substring(0, 4)}`;
      codes.push(code);
    }
    return codes;
  }

  @Get()
  @Permissions("codes:read")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Listar códigos y su estado" })
  async list() {
    // In a real implementation, would query the repository
    return [];
  }
}