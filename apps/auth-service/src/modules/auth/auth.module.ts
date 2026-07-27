import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import type { JwtSignOptions } from "@nestjs/jwt";
import { UsersModule } from "../users/users.module";
import { AuthMessages } from "./auth.messages";
import { AuthService } from "./auth.service";

@Module({
  imports: [
    UsersModule,
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
  controllers: [AuthMessages],
  providers: [AuthService],
})
export class AuthModule {}
