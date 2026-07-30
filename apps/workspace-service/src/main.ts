import { Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { config } from "dotenv";
import "reflect-metadata";
import { AppModule } from "./app.module";
import { createRabbitmqOptions } from "@rangein-task-system/common";

config({ path: "../../.env" });
config({ path: ".env" });
config({ path: "../api/.env" });

async function bootstrap() {
  const app = await NestFactory.createMicroservice(
    AppModule,
    createRabbitmqOptions(new ConfigService(), "workspace"),
  );
  await app.listen();

  new Logger("WorkspaceService").log(
    "Workspace service is listening on RabbitMQ",
  );
}

void bootstrap();
