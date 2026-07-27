import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { BoardsModule } from "./modules/boards/boards.module";
import { TasksModule } from "./modules/tasks/tasks.module";
import { WorkspacesModule } from "./modules/workspaces/workspaces.module";
import { PrismaModule } from "./prisma/prisma.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ["../../.env", ".env", "../api/.env"],
      isGlobal: true,
    }),
    PrismaModule,
    WorkspacesModule,
    BoardsModule,
    TasksModule,
  ],
})
export class AppModule {}
