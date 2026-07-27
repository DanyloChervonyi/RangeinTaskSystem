import { Module } from "@nestjs/common";
import { RabbitmqModule } from "../../infrastructure/rabbitmq/rabbitmq.module";
import { TasksController } from "./tasks.controller";

@Module({
  imports: [RabbitmqModule],
  controllers: [TasksController],
})
export class TasksModule {}
