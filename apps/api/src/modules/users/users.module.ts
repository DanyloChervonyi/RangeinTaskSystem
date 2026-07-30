import { Module } from "@nestjs/common";
import { RabbitmqModule } from "../../infrastructure/rabbitmq/rabbitmq.module";
import { UsersController } from "./users.controller";

@Module({
  imports: [RabbitmqModule],
  controllers: [UsersController],
})
export class UsersModule {}
