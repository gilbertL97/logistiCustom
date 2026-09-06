import { Controller, Get, Post, Body, Param, HttpCode, HttpStatus } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { CodesRepository } from "../../database/ports/codes.repository";

@ApiTags("admin")
@Controller("api/v1/admin/codes")
export class CodesController {
  constructor(private readonly codesRepository: CodesRepository) {}

  @Post()
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
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Listar códigos y su estado" })
  async list() {
    // In a real implementation, would query the repository
    return [];
  }
}