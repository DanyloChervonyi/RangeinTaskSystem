import { Body, Controller, Post } from "@nestjs/common";
import { MessagePatterns } from "@rangein-task-system/common";
import { RabbitmqClientService } from "../../infrastructure/rabbitmq/rabbitmq-client.service";
import { ZodValidationPipe } from "@rangein-task-system/common";
import {
  type LoginDto,
  loginSchema,
  type RegisterDto,
  registerSchema,
} from "@rangein-task-system/common";

@Controller("auth")
export class AuthController {
  constructor(private readonly rabbitmqClient: RabbitmqClientService) {}

  @Post("register")
  register(
    @Body(new ZodValidationPipe(registerSchema)) registerDto: RegisterDto,
  ) {
    return this.rabbitmqClient.request(MessagePatterns.auth.register, registerDto);
  }

  @Post("login")
  login(@Body(new ZodValidationPipe(loginSchema)) loginDto: LoginDto) {
    return this.rabbitmqClient.request(MessagePatterns.auth.login, loginDto);
  }
}
