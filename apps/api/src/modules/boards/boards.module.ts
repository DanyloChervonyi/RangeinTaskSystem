import { Module } from "@nestjs/common";
import { PrismaModule } from "../../prisma/prisma.module";
import { WorkspacesModule } from "../workspaces/workspaces.module";
import { BoardsController } from "./boards.controller";
import { BoardsService } from "./boards.service";

@Module({
  imports: [PrismaModule, WorkspacesModule],
  controllers: [BoardsController],
  providers: [BoardsService],
})
export class BoardsModule {}
