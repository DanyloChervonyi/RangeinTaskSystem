import { Module } from "@nestjs/common";
import { RabbitmqModule } from "../../infrastructure/rabbitmq/rabbitmq.module";
import { RedisModule } from "../../infrastructure/redis/redis.module";
import { PrismaModule } from "../../prisma/prisma.module";
import { WorkspaceAccessService } from "./workspace-access.service";
import { WorkspacesController } from "./workspaces.controller";
import { WorkspacesMessages } from "./workspaces.messages";
import { WorkspacesService } from "./workspaces.service";

@Module({
  imports: [PrismaModule, RabbitmqModule, RedisModule],
  controllers: [WorkspacesController, WorkspacesMessages],
  providers: [WorkspacesService, WorkspaceAccessService],
  exports: [WorkspaceAccessService],
})
export class WorkspacesModule {}
