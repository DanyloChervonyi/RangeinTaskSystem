import { Module } from "@nestjs/common";
import { RabbitmqModule } from "../../infrastructure/rabbitmq/rabbitmq.module";
import { WorkspacesController } from "./workspaces.controller";

@Module({
  imports: [RabbitmqModule],
  controllers: [WorkspacesController],
})
export class WorkspacesModule {}
