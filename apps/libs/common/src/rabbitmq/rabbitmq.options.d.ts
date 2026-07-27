import { ConfigService } from "@nestjs/config";
import type { RmqOptions } from "@nestjs/microservices";
export type RabbitmqQueueName = "auth" | "workspace";
export declare function createRabbitmqOptions(configService: ConfigService, queueName: RabbitmqQueueName): RmqOptions;
