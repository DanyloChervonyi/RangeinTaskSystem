import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { ClientProxy, ClientsModule } from "@nestjs/microservices";
import {
  AUTH_RABBITMQ_CLIENT,
  createRabbitmqOptions,
  WORKSPACE_RABBITMQ_CLIENT,
} from "@rangein-task-system/common";
import { RabbitmqClientService } from "./rabbitmq-client.service";

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        imports: [ConfigModule],
        inject: [ConfigService],
        name: AUTH_RABBITMQ_CLIENT,
        useFactory: (configService: ConfigService) =>
          createRabbitmqOptions(configService, "auth"),
      },
      {
        imports: [ConfigModule],
        inject: [ConfigService],
        name: WORKSPACE_RABBITMQ_CLIENT,
        useFactory: (configService: ConfigService) =>
          createRabbitmqOptions(configService, "workspace"),
      },
    ]),
  ],
  providers: [
    {
      inject: [AUTH_RABBITMQ_CLIENT, WORKSPACE_RABBITMQ_CLIENT, ConfigService],
      provide: RabbitmqClientService,
      useFactory: (
        authClient: ClientProxy,
        workspaceClient: ClientProxy,
        configService: ConfigService,
      ) =>
        new RabbitmqClientService(authClient, workspaceClient, configService),
    },
  ],
  exports: [RabbitmqClientService],
})
export class RabbitmqModule {}
