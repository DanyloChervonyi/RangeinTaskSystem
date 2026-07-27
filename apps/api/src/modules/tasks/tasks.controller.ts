import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import { CurrentUser } from "@rangein-task-system/common";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { ZodValidationPipe } from "@rangein-task-system/common";
import { idSchema, optionalIdSchema } from "@rangein-task-system/common";
import { MessagePatterns } from "@rangein-task-system/common";
import { RabbitmqClientService } from "../../infrastructure/rabbitmq/rabbitmq-client.service";
import type { JwtUser } from "@rangein-task-system/common";
import {
  type CreateTaskDto,
  createTaskSchema,
  type UpdateTaskDto,
  updateTaskSchema,
} from "@rangein-task-system/common";

@Controller("tasks")
@UseGuards(JwtAuthGuard)
export class TasksController {
  constructor(private readonly rabbitmqClient: RabbitmqClientService) {}

  @Get()
  findAll(
    @CurrentUser() user: JwtUser,
    @Query("boardId", new ZodValidationPipe(optionalIdSchema)) boardId?: string,
  ) {
    return this.rabbitmqClient.request(MessagePatterns.tasks.findAll, {
      userId: user.id,
      boardId,
    });
  }

  @Get(":id")
  findOne(
    @CurrentUser() user: JwtUser,
    @Param("id", new ZodValidationPipe(idSchema)) id: string,
  ) {
    return this.rabbitmqClient.request(MessagePatterns.tasks.findOne, {
      userId: user.id,
      id,
    });
  }

  @Post()
  create(
    @CurrentUser() user: JwtUser,
    @Body(new ZodValidationPipe(createTaskSchema)) createTaskDto: CreateTaskDto,
  ) {
    return this.rabbitmqClient.request(MessagePatterns.tasks.create, {
      userId: user.id,
      dto: createTaskDto,
    });
  }

  @Patch(":id")
  update(
    @CurrentUser() user: JwtUser,
    @Param("id", new ZodValidationPipe(idSchema)) id: string,
    @Body(new ZodValidationPipe(updateTaskSchema)) updateTaskDto: UpdateTaskDto,
  ) {
    return this.rabbitmqClient.request(MessagePatterns.tasks.update, {
      userId: user.id,
      id,
      dto: updateTaskDto,
    });
  }

  @Delete(":id")
  remove(
    @CurrentUser() user: JwtUser,
    @Param("id", new ZodValidationPipe(idSchema)) id: string,
  ) {
    return this.rabbitmqClient.request(MessagePatterns.tasks.remove, {
      userId: user.id,
      id,
    });
  }
}
