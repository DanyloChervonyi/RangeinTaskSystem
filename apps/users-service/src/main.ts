import { Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { createRabbitmqOptions } from "@rangein-task-system/common";
import { config } from "dotenv";
import "reflect-metadata";
import { AppModule } from "./app.module";

config({ path: "../../.env" });
config({ path: ".env" });
config({ path: "../api/.env" });

async function bootstrap() {
  const app = await NestFactory.createMicroservice(
    AppModule,
    createRabbitmqOptions(new ConfigService(), "users"),
  );
  await app.listen();

  new Logger("UsersService").log("Users service is listening on RabbitMQ");
}

void bootstrap();
