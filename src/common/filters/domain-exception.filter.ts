import { ExceptionFilter, Catch, ArgumentsHost, Logger } from "@nestjs/common";
import { Request } from "express";
import { Response } from "express";

@Catch()
export class DomainExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(DomainExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = this.getStatus(exception);

    this.logger.error(
      `${request.method} ${request.url} - ${status}`,
      exception instanceof Error ? exception.stack : undefined,
    );

    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      requestId: request.headers["x-request-id"] || "unknown",
      message: this.getMessage(exception),
    };

    response.status(status).json(errorResponse);
  }

  private getStatus(exception: unknown): number {
    if (exception instanceof Error) {
      if ((exception as any).code) {
        const code = (exception as any).code;
        if (code === "CODE_INVALID") return 403;
        if (code === "CODE_ALREADY_USED") return 403;
        if (code === "DEVICE_ALREADY_TRIALED") return 409;
        if (code === "TRIAL_EXPIRED") return 403;
        if (code === "RENEWAL_LIMIT_REACHED") return 403;
      }
      return 500;
    }
    return 500;
  }

  private getMessage(exception: unknown): string {
    if (exception instanceof Error) {
      return (exception as any).message || "Error interno";
    }
    if (typeof exception === "object" && exception !== null) {
      return (exception as any).message || "Error interno";
    }
    return "Error interno";
  }
}