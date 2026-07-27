import { ConfigService } from "@nestjs/config";
import { Transport } from "@nestjs/microservices";
import type { RmqOptions } from "@nestjs/microservices";
import {
  RABBITMQ_AUTH_QUEUE,
  RABBITMQ_WORKSPACE_QUEUE,
} from "./rabbitmq.constants";

export type RabbitmqQueueName = "auth" | "workspace";

export function createRabbitmqOptions(
  configService: ConfigService,
  queueName: RabbitmqQueueName,
): RmqOptions {
  const queue =
    queueName === "auth"
      ? (configService.get<string>("RABBITMQ_AUTH_QUEUE") ??
        RABBITMQ_AUTH_QUEUE)
      : (configService.get<string>("RABBITMQ_WORKSPACE_QUEUE") ??
        RABBITMQ_WORKSPACE_QUEUE);

  return {
    transport: Transport.RMQ,
    options: {
      urls: [
        configService.get<string>("RABBITMQ_URL") ??
          "amqp://rabbit:rabbit@localhost:5672",
      ],
      queue,
      queueOptions: {
        durable: true,
      },
    },
  };
}
