import { Controller, UseFilters } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { MessagePatterns } from "@rangein-task-system/common";
import { RabbitmqHttpExceptionFilter } from "@rangein-task-system/common";
import type { CreateTaskDto, UpdateTaskDto } from "@rangein-task-system/common";
import { TasksService } from "./tasks.service";

@Controller()
@UseFilters(new RabbitmqHttpExceptionFilter())
export class TasksMessages {
  constructor(private readonly tasksService: TasksService) {}

  @MessagePattern(MessagePatterns.tasks.findAll)
  findAll(@Payload() payload: { userId: string; boardId?: string }) {
    return this.tasksService.findAll(payload.userId, payload.boardId);
  }

  @MessagePattern(MessagePatterns.tasks.findOne)
  findOne(@Payload() payload: { userId: string; id: string }) {
    return this.tasksService.findOne(payload.userId, payload.id);
  }

  @MessagePattern(MessagePatterns.tasks.create)
  create(@Payload() payload: { userId: string; dto: CreateTaskDto }) {
    return this.tasksService.create(payload.userId, payload.dto);
  }

  @MessagePattern(MessagePatterns.tasks.update)
  update(
    @Payload() payload: { userId: string; id: string; dto: UpdateTaskDto },
  ) {
    return this.tasksService.update(payload.userId, payload.id, payload.dto);
  }

  @MessagePattern(MessagePatterns.tasks.remove)
  remove(@Payload() payload: { userId: string; id: string }) {
    return this.tasksService.remove(payload.userId, payload.id);
  }
}
