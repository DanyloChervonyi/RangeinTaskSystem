import { Controller, UseFilters } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { MessagePatterns } from "../../infrastructure/rabbitmq/rabbitmq.constants";
import { RabbitmqHttpExceptionFilter } from "../../infrastructure/rabbitmq/rabbitmq-http-exception.filter";
import { AuthService } from "./auth.service";
import type { LoginDto, RegisterDto } from "./dto/auth.dto";

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
