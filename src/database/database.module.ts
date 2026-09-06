import { Module } from "@nestjs/common";
import { PrismaRepositoriesModule } from "./prisma/prisma.repositories.module";

@Module({
  imports: [PrismaRepositoriesModule],
  exports: [PrismaRepositoriesModule],
})
export class DatabaseModule {
  static forRoot() {
    return {
      module: DatabaseModule,
      imports: [PrismaRepositoriesModule],
      exports: [PrismaRepositoriesModule],
    };
  }
}