import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { WorkspacesModule } from "./modules/workspaces/workspaces.module";
import { PrismaModule } from "./prisma/prisma.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    PrismaModule,
    WorkspacesModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
