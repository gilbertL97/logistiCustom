import { Module } from "@nestjs/common";
import { ActivationController } from "./controllers/activation.controller";
import { LicenseController } from "./controllers/license.controller";
import { LicensesService } from "./services/licenses.service";
import { DatabaseModule } from "../database/database.module";

@Module({
  imports: [DatabaseModule.forRoot()],
  controllers: [ActivationController, LicenseController],
  providers: [LicensesService],
})
export class LicensingModule {}