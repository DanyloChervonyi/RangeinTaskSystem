import { Module } from "@nestjs/common";
import { PrismaModule } from "../../prisma/prisma.module";
import { WorkspacesModule } from "../workspaces/workspaces.module";
import {
  BoardCreateOwnerGuard,
  BoardListAccessGuard,
  BoardOwnerGuard,
  BoardReadAccessGuard,
} from "../../common/guards/boards-access.guards";
import { BoardsController } from "./boards.controller";
import { BoardsService } from "./boards.service";

@Module({
  imports: [PrismaModule, WorkspacesModule],
  controllers: [BoardsController],
  providers: [
    BoardsService,
    BoardCreateOwnerGuard,
    BoardListAccessGuard,
    BoardOwnerGuard,
    BoardReadAccessGuard,
  ],
})
export class BoardsModule {}
