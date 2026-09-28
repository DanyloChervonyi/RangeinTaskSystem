import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { UsersModule } from "./modules/users/users.module";
import { PrismaModule } from "./prisma/prisma.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ["../../.env", ".env", "../api/.env"],
      isGlobal: true,
    }),
    PrismaModule,
    UsersModule,
  ],
})
export class AppModule {}
