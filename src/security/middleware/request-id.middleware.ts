import { Injectable, NestMiddleware } from "@nestjs/common";

@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
  use(req: any, res: any, next: Function) {
    req.headers["x-request-id"] = req.headers["x-request-id"] || crypto.randomUUID();
    next();
  }
}