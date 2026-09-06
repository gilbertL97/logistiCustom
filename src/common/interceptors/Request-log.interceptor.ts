import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from "@nestjs/common";

@Injectable()
export class RequestLogInterceptor implements NestInterceptor {
  private readonly logger: Logger;

  constructor() {
    this.logger = new Logger(RequestLogInterceptor.name);
  }

  intercept(context: ExecutionContext, next: CallHandler): any {
    const request = context.switchToHttp().getRequest();
    const now = Date.now();
    const userAgent = request.get("User-Agent") || "";
    const ip = request.ip || "";

    const response = next.handle();
    this.logger.log(`${request.method} ${request.url} - IP: ${ip} - UA: ${userAgent.substring(0, 50)}...`);
    return response;
  }
}