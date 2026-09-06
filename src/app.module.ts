import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { DatabaseModule } from "./database/database.module";
import { CommonModule } from "./common/common.module";
import { SecurityModule } from "./security/security.module";
import { LicensingModule } from "./licensing/licensing.module";
import { AdminModule } from "./admin/admin.module";
import { HealthModule } from "./health/health.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [".env"],
    }),
    DatabaseModule.forRoot("prisma"),
    CommonModule,
    SecurityModule,
    LicensingModule,
    AdminModule,
    HealthModule,
  ],
})
export class AppModule {}