import { Module } from "@nestjs/common";
import { ConfigModule as NestConfigModule } from "@nestjs/config";

@Module({
  imports: [
    NestConfigModule.forRoot({
      envFilePath: [".env"],
    }),
  ],
  exports: [],
})
export class CommonModule {}

export const config = {
  NOR: "production",
  PORT: 3000,
};