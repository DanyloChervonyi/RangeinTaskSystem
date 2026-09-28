import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AuthModule } from "./modules/auth/auth.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ["../../.env", ".env", "../api/.env"],
      isGlobal: true,
    }),
    AuthModule,
  ],
})
export class AppModule {}
