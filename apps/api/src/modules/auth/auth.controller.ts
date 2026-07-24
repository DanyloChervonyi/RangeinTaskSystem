import { Body, Controller, Post } from "@nestjs/common";
import { MessagePatterns } from "../../infrastructure/rabbitmq/rabbitmq.constants";
import { RabbitmqClientService } from "../../infrastructure/rabbitmq/rabbitmq-client.service";
import { ZodValidationPipe } from "../../common/pipes/zod-validation.pipe";
import {
  type LoginDto,
  loginSchema,
  type RegisterDto,
  registerSchema,
} from "./dto/auth.dto";

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
