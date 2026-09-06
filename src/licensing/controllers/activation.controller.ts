import { Controller, Post, Body } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { ActivateRequestDto } from "../dto/activate-request.dto";
import { LicenseResponseDto } from "../dto/license-response.dto";
import { LicensesService } from "../services/licenses.service";

@ApiTags("licensing")
@Controller("api/v1/license")
export class ActivationController {
  constructor(private readonly licensesService: LicensesService) {}

  @Post("activate")
  @ApiOperation({ summary: "Activar trial o renovar" })
  @ApiResponse({ status: 200, type: LicenseResponseDto })
  @ApiResponse({ status: 400, description: "Código inválido" })
  @ApiResponse({ status: 403, description: "Código ya usado o inválido" })
  @ApiResponse({ status: 409, description: "Dispositivo ya tiene trial activo" })
  async activate(@Body() dto: ActivateRequestDto) {
    const ip = "unknown";
    const userAgent = "";
    const result = await this.licensesService.activate(dto, ip, userAgent);
    return result;
  }
}