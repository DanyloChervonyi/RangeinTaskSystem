import { Module } from "@nestjs/common";
import { PrismaModule } from "../../prisma/prisma.module";
import { UsersMessages } from "./users.messages";
import { UsersService } from "./users.service";

@Module({
  imports: [PrismaModule],
  controllers: [UsersMessages],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
