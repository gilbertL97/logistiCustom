import { Controller, Post, Body, HttpCode, HttpStatus } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { CredentialsInvalidException } from "../../errors/custom-exception";

@ApiTags("admin")
@Controller("api/v1/admin")
export class AdminAuthController {
  @Post("login")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Login admin" })
  async login(@Body() body: { email: string; password: string }) {
    const { email, password } = body;
    if (email === process.env.ADMIN_BOOTSTRAP_EMAIL && password === process.env.ADMIN_BOOTSTRAP_PASSWORD) {
      return { access_token: "admin-jwt-token" };
    }
    throw new CredentialsInvalidException();
  }
}