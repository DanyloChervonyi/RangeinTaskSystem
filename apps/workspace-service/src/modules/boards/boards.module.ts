import { Module } from "@nestjs/common";
import { RedisModule } from "../../infrastructure/redis/redis.module";
import { PrismaModule } from "../../prisma/prisma.module";
import { WorkspacesModule } from "../workspaces/workspaces.module";
import { BoardsMessages } from "./boards.messages";
import { BoardsService } from "./boards.service";

@Module({
  imports: [PrismaModule, WorkspacesModule, RedisModule],
  controllers: [BoardsMessages],
  providers: [BoardsService],
})
export class BoardsModule {}
