import { ConfigService } from "@nestjs/config";
import { Transport } from "@nestjs/microservices";
import type { RmqOptions } from "@nestjs/microservices";
import { RABBITMQ_QUEUE } from "./rabbitmq.constants";

export function createRabbitmqOptions(configService: ConfigService): RmqOptions {
  return {
    transport: Transport.RMQ,
    options: {
      urls: [
        configService.get<string>("RABBITMQ_URL") ??
          "amqp://rabbit:rabbit@localhost:5672",
      ],
      queue: configService.get<string>("RABBITMQ_QUEUE") ?? RABBITMQ_QUEUE,
      queueOptions: {
        durable: true,
      },
    },
  };
}
