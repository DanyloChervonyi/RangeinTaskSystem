import { Module } from "@nestjs/common";
import { RabbitmqModule } from "../../infrastructure/rabbitmq/rabbitmq.module";
import { RedisModule } from "../../infrastructure/redis/redis.module";
import { PrismaModule } from "../../prisma/prisma.module";
import { WorkspacesModule } from "../workspaces/workspaces.module";
import {
  BoardCreateOwnerGuard,
  BoardListAccessGuard,
  BoardOwnerGuard,
  BoardReadAccessGuard,
} from "../../common/guards/boards-access.guards";
import { BoardsController } from "./boards.controller";
import { BoardsMessages } from "./boards.messages";
import { BoardsService } from "./boards.service";

@Module({
  imports: [PrismaModule, WorkspacesModule, RabbitmqModule, RedisModule],
  controllers: [BoardsController, BoardsMessages],
  providers: [
    BoardsService,
    BoardCreateOwnerGuard,
    BoardListAccessGuard,
    BoardOwnerGuard,
    BoardReadAccessGuard,
  ],
})
export class BoardsModule {}
