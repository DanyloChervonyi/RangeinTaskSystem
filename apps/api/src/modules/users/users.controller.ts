import { Controller, Get, Param, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { ZodValidationPipe } from "@rangein-task-system/common";
import { idSchema } from "@rangein-task-system/common";
import { MessagePatterns } from "@rangein-task-system/common";
import { RabbitmqClientService } from "../../infrastructure/rabbitmq/rabbitmq-client.service";

@Controller("users")
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly rabbitmqClient: RabbitmqClientService) {}

  @Get()
  findAll() {
    return this.rabbitmqClient.request(MessagePatterns.users.findAll, {});
  }

  @Get(":id")
  findOne(@Param("id", new ZodValidationPipe(idSchema)) id: string) {
    return this.rabbitmqClient.request(MessagePatterns.users.findOne, id);
  }
}
