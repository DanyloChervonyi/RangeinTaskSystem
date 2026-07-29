import { Controller, UseFilters } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { MessagePatterns } from "@rangein-task-system/common/src/rabbitmq/rabbitmq.constants";
import { RabbitmqHttpExceptionFilter } from "@rangein-task-system/common";
import { AuthService } from "./auth.service";
import type { LoginDto, RegisterDto } from "@rangein-task-system/common";

@Controller()
@UseFilters(new RabbitmqHttpExceptionFilter())
export class AuthMessages {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern(MessagePatterns.auth.register)
  register(@Payload() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @MessagePattern(MessagePatterns.auth.login)
  login(@Payload() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}
