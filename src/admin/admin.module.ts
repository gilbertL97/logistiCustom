import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { DatabaseModule } from "../database/database.module";
import { CodesController } from "./controllers/codes.controller";
import { DevicesController } from "./controllers/devices.controller";
import { AdminAuthController } from "./controllers/admin-auth.controller";
import { RbacModule } from "../rbac/rbac.module";

@Module({
  imports: [
    DatabaseModule.forRoot(),
    JwtModule.register({}),
    RbacModule.forRoot({ principalProperty: "admin" }),
  ],
  controllers: [CodesController, DevicesController, AdminAuthController],
  providers: [],
})
export class AdminModule { }