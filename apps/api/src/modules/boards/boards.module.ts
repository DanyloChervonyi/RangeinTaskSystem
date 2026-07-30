import { Module } from "@nestjs/common";
import { RabbitmqModule } from "../../infrastructure/rabbitmq/rabbitmq.module";
import { BoardsController } from "./boards.controller";

@Module({
  imports: [RabbitmqModule],
  controllers: [BoardsController],
})
export class BoardsModule {}
