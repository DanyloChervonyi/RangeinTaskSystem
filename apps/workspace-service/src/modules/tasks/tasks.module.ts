import { Module } from "@nestjs/common";
import { RedisModule } from "../../infrastructure/redis/redis.module";
import { PrismaModule } from "../../prisma/prisma.module";
import { WorkspacesModule } from "../workspaces/workspaces.module";
import { TasksMessages } from "./tasks.messages";
import { TasksService } from "./tasks.service";

@Module({
  imports: [PrismaModule, WorkspacesModule, RedisModule],
  controllers: [TasksMessages],
  providers: [TasksService],
})
export class TasksModule {}
