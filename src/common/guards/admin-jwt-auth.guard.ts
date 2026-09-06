import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AdminJwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization || "";

    if (!authHeader.startsWith("Bearer ")) {
      return false;
    }

    const token = authHeader.split(" ")[1];

    try {
      const payload = this.jwtService.verify(token, {
        secret: process.env.ADMIN_JWT_SECRET,
      });
      request.admin = payload;
      return true;
    } catch (error) {
      return false;
    }
  }
}