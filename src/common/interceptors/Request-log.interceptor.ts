import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from "@nestjs/common";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { Logger, PinoLogger } from "nestjs-pino";

@Injectable()
export class RequestLogInterceptor implements NestInterceptor {
  private readonly logger: Logger;

  constructor() {
    this.logger = new Logger(RequestLogInterceptor.name);
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const now = Date.now();
    const userAgent = request.get("User-Agent") || "";
    const ip = request.ip || "";

    return next.handle().pipe(
      tap((data) => {
        const responseTime = Date.now() - now;
        const truncatedFp = request.device
          ? `${request.device.fingerprint.substring(0, 16)}...`
          : "unknown";
        this.logger.log(
          `${request.method} ${request.url} - IP: ${ip} - UA: ${userAgent
            .substring(0, 50)}... - Device: ${truncatedFp} - ${responseTime}ms`,
        );
      }),
    );
  }
}