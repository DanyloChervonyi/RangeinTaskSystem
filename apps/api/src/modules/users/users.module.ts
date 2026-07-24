import { Module } from "@nestjs/common";
import { RabbitmqModule } from "../../infrastructure/rabbitmq/rabbitmq.module";
import { PrismaModule } from "../../prisma/prisma.module";
import { UsersController } from "./users.controller";
import { UsersMessages } from "./users.messages";
import { UsersService } from "./users.service";

@Module({
  imports: [PrismaModule, RabbitmqModule],
  controllers: [UsersController, UsersMessages],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
