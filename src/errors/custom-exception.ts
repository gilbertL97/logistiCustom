import { HttpStatus, ExceptionFilter, ArgumentsHost } from "@nestjs/common";
import { ExceptionFilter as BaseExceptionFilter } from "@nestjs/core";

export class AppException extends Error {
  public readonly status: number;
  public readonly code: string;
  public readonly context?: string;

  constructor(message: string, status: number = HttpStatusCodes.INTERNAL_SERVER, code: string = ErrorCodes.UNEXPECTED_ERROR, context?: string) {
    super(message);
    this.name = "AppException";
    this.status = status;
    this.code = code;
    this.context = context;
  }
}

export class CredentialsInvalidException extends AppException {
  constructor() {
    super("Credenciales inválidas", HttpStatusCodes.FORBIDDEN, ErrorCodes.CREDENTIALS_INVALID);
  }
}

export class CodeInvalidException extends AppException {
  constructor() {
    super("Código inválido", HttpStatusCodes.FORBIDDEN, ErrorCodes.CODE_INVALID);
  }
}

export class CodeAlreadyUsedException extends AppException {
  constructor() {
    super("El código ya ha sido utilizado", HttpStatusCodes.FORBIDDEN, ErrorCodes.CODE_ALREADY_USED);
  }
}

export class DeviceAlreadyTrialedException extends AppException {
  constructor() {
    super("El dispositivo ya ha sido probado", HttpStatusCodes.FORBIDDEN, ErrorCodes.DEVICE_ALREADY_TRIALED);
  }
}

export class UnexpectedErrorException extends AppException {
  constructor(context?: string) {
    super("Error inesperado", HttpStatusCodes.INTERNAL_SERVER, ErrorCodes.UNEXPECTED_ERROR, context);
  }
}