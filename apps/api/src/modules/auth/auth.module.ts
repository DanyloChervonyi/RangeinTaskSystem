import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import type { JwtSignOptions } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { RabbitmqModule } from "../../infrastructure/rabbitmq/rabbitmq.module";
import { UsersModule } from "../users/users.module";
import { AuthMessages } from "./auth.messages";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtStrategy } from "./jwt.strategy";

@Module({
  imports: [
    RabbitmqModule,
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>("JWT_SECRET") ?? "dev-secret",
        signOptions: {
          expiresIn:
            configService.get<JwtSignOptions["expiresIn"]>("JWT_EXPIRES_IN") ??
            "7d",
        },
      }),
    }),
  ],
  controllers: [AuthController, AuthMessages],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
