import { Module } from "@nestjs/common";
import { DatabaseModule } from "../database/database.module";
import { CodesController } from "./controllers/codes.controller";
import { DevicesController } from "./controllers/devices.controller";
import { AdminAuthController } from "./controllers/admin-auth.controller";

@Module({
  imports: [DatabaseModule.forRoot("prisma")],
  controllers: [CodesController, DevicesController, AdminAuthController],
  providers: [],
})
export class AdminModule {}