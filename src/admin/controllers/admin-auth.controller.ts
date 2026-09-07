import { Controller, Post, Body, HttpCode, HttpStatus } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { JwtService } from "@nestjs/jwt";
import { CredentialsInvalidException } from "../../errors/custom-exception";

@ApiTags("admin")
@Controller("api/v1/admin")
export class AdminAuthController {
  constructor(private readonly jwtService: JwtService) { }

  @Post("login")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Login admin" })
  async login(@Body() body: { email: string; password: string }) {
    const { email, password } = body;
    if (email === process.env.ADMIN_BOOTSTRAP_EMAIL && password === process.env.ADMIN_BOOTSTRAP_PASSWORD) {
      const access_token = await this.jwtService.signAsync(
        {
          sub: email,
          permissions: ["codes:create", "codes:read", "devices:read", "devices:revoke", "devices:extend"],
        },
        {
          secret: process.env.ADMIN_JWT_SECRET,
          expiresIn: Number(process.env.ADMIN_TOKEN_TTL_HOURS || 8) * 60 * 60,
        },
      );
      return { access_token };
    }
    throw new CredentialsInvalidException();
  }
}