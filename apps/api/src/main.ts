import { Logger, ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import "reflect-metadata";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger("Bootstrap");
  const configService = app.get(ConfigService);
  const corsOrigin =
    configService.get<string>("CORS_ORIGIN") ?? "http://localhost:5173";
  const port = configService.get<number>("PORT") ?? 3000;

  app.enableCors({
    origin: corsOrigin,
    credentials: true,
  });
  app.setGlobalPrefix("api");
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );
  await app.listen(port);

  const url = await app.getUrl();
  logger.log(`🚀 Server started: ${url}`);
  logger.log(`📡 API: ${url}/api`);
  logger.log("🐇 API Gateway connected to RabbitMQ clients");
}

void bootstrap();
