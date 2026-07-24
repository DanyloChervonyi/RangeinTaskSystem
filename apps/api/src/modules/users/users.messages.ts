import { Controller, UseFilters } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { MessagePatterns } from "../../infrastructure/rabbitmq/rabbitmq.constants";
import { RabbitmqHttpExceptionFilter } from "../../infrastructure/rabbitmq/rabbitmq-http-exception.filter";
import { UsersService } from "./users.service";

@Controller()
@UseFilters(new RabbitmqHttpExceptionFilter())
export class UsersMessages {
  constructor(private readonly usersService: UsersService) {}

  @MessagePattern(MessagePatterns.users.findAll)
  findAll() {
    return this.usersService.findAll();
  }

  @MessagePattern(MessagePatterns.users.findOne)
  findOne(@Payload() id: string) {
    return this.usersService.findById(id);
  }
}
