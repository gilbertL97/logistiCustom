import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ConfigService } from "@nestjs/config";
import { ValidationPipe } from "@nestjs/common";
import { z } from "zod";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  // Global pipe with Zod validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    })
  );

  // Security headers
  app.use((req, res, next) => {
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("X-Frame-Options", "DENY");
    next();
  });

  const port = configService.get<number>("PORT") || 3000;
  await app.listen(port);
  console.log(`🚀 Licensing API running on http://0.0.0.0:${port}`);
}

bootstrap().catch((err) => {
  console.error("❌ Failed to bootstrap:", err);
  process.exit(1);
});