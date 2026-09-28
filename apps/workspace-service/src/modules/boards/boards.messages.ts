import { Controller, UseFilters } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { MessagePatterns } from "@rangein-task-system/common";
import { RabbitmqHttpExceptionFilter } from "@rangein-task-system/common";
import { BoardsService } from "./boards.service";
import type { CreateBoardDto, UpdateBoardDto } from "@rangein-task-system/common";

@Controller()
@UseFilters(new RabbitmqHttpExceptionFilter())
export class BoardsMessages {
  constructor(private readonly boardsService: BoardsService) {}

  @MessagePattern(MessagePatterns.boards.findAll)
  findAll(@Payload() payload: { userId: string; workspaceId?: string }) {
    return this.boardsService.findAll(payload.userId, payload.workspaceId);
  }

  @MessagePattern(MessagePatterns.boards.findOne)
  findOne(@Payload() payload: { userId: string; id: string }) {
    return this.boardsService.findOne(payload.userId, payload.id);
  }

  @MessagePattern(MessagePatterns.boards.create)
  create(@Payload() payload: { userId: string; dto: CreateBoardDto }) {
    return this.boardsService.create(payload.userId, payload.dto);
  }

  @MessagePattern(MessagePatterns.boards.update)
  update(
    @Payload() payload: { userId: string; id: string; dto: UpdateBoardDto },
  ) {
    return this.boardsService.update(payload.userId, payload.id, payload.dto);
  }

  @MessagePattern(MessagePatterns.boards.remove)
  remove(@Payload() payload: { userId: string; id: string }) {
    return this.boardsService.remove(payload.userId, payload.id);
  }
}
