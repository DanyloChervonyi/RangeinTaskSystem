import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { ClientProxy, ClientsModule } from "@nestjs/microservices";
import { RABBITMQ_CLIENT } from "./rabbitmq.constants";
import { RabbitmqClientService } from "./rabbitmq-client.service";
import { createRabbitmqOptions } from "./rabbitmq.options";

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        imports: [ConfigModule],
        inject: [ConfigService],
        name: RABBITMQ_CLIENT,
        useFactory: createRabbitmqOptions,
      },
    ]),
  ],
  providers: [
    {
      inject: [RABBITMQ_CLIENT, ConfigService],
      provide: RabbitmqClientService,
      useFactory: (client: ClientProxy, configService: ConfigService) =>
        new RabbitmqClientService(client, configService),
    },
  ],
  exports: [RabbitmqClientService],
})
export class RabbitmqModule {}
