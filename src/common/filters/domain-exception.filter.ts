import { ExceptionFilter, Catch, ArgumentsHost, Logger, HttpStatus } from "@nestjs/common";
import { Request } from "express";
import { Response } from "express";
import { AppException, ErrorCodes, HttpStatusCodes } from "../../errors/custom-exception";

@Catch()
export class DomainExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(DomainExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = this.getStatus(exception);
    const message = this.getMessage(exception);

    this.logger.error(
      `${request.method} ${request.url} - ${status} - ${message}`,
      exception instanceof Error ? exception.stack : undefined,
    );

    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      requestId: request.headers["x-request-id"] || "unknown",
      message,
      code: (exception as any)?.code || ErrorCodes.UNEXPECTED_ERROR,
    };

    response.status(status).json(errorResponse);
  }

  private getStatus(exception: unknown): number {
    if (exception instanceof AppException) {
      return exception.status;
    }
    if (exception instanceof Error) {
      return HttpStatusCodes.INTERNAL_SERVER;
    }
    return HttpStatusCodes.INTERNAL_SERVER;
  }

  private getMessage(exception: unknown): string {
    if (exception instanceof AppException) {
      return exception.message;
    }
    if (exception instanceof Error) {
      return exception.message || "Error interno";
    }
    return "Error interno";
  }
}