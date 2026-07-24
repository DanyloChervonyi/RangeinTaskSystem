import { Module } from "@nestjs/common";
import { RabbitmqModule } from "../../infrastructure/rabbitmq/rabbitmq.module";
import { RedisModule } from "../../infrastructure/redis/redis.module";
import { PrismaModule } from "../../prisma/prisma.module";
import { WorkspacesModule } from "../workspaces/workspaces.module";
import { TasksController } from "./tasks.controller";
import { TasksMessages } from "./tasks.messages";
import { TasksService } from "./tasks.service";

@Module({
  imports: [PrismaModule, WorkspacesModule, RabbitmqModule, RedisModule],
  controllers: [TasksController, TasksMessages],
  providers: [TasksService],
})
export class TasksModule {}
