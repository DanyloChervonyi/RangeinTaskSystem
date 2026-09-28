import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./modules/auth/auth.module";
import { BoardsModule } from "./modules/boards/boards.module";
import { TasksModule } from "./modules/tasks/tasks.module";
import { UsersModule } from "./modules/users/users.module";
import { WorkspacesModule } from "./modules/workspaces/workspaces.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ["../../.env", ".env"],
      isGlobal: true
    }),
    AuthModule,
    UsersModule,
    WorkspacesModule,
    BoardsModule,
    TasksModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
