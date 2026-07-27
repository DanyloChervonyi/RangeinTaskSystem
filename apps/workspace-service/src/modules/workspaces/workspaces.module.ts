import { Module } from "@nestjs/common";
import { RedisModule } from "../../infrastructure/redis/redis.module";
import { PrismaModule } from "../../prisma/prisma.module";
import { WorkspaceAccessService } from "./workspace-access.service";
import { WorkspacesMessages } from "./workspaces.messages";
import { WorkspacesService } from "./workspaces.service";

@Module({
  imports: [PrismaModule, RedisModule],
  controllers: [WorkspacesMessages],
  providers: [WorkspacesService, WorkspaceAccessService],
  exports: [WorkspaceAccessService],
})
export class WorkspacesModule {}
