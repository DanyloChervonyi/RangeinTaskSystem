import { Controller, UseFilters } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { MessagePatterns } from "../../infrastructure/rabbitmq/rabbitmq.constants";
import { RabbitmqHttpExceptionFilter } from "../../infrastructure/rabbitmq/rabbitmq-http-exception.filter";
import { BoardsService } from "./boards.service";
import type { CreateBoardDto, UpdateBoardDto } from "./dto/board.dto";

@Controller()
@UseFilters(new RabbitmqHttpExceptionFilter())
export class BoardsMessages {
  constructor(private readonly boardsService: BoardsService) {}

  @MessagePattern(MessagePatterns.boards.findAll)
  findAll(@Payload() payload: { userId: string; workspaceId?: string }) {
    return this.boardsService.findAll(payload.userId, payload.workspaceId);
  }

  @MessagePattern(MessagePatterns.boards.findOne)
  findOne(@Payload() id: string) {
    return this.boardsService.findOne(id);
  }

  @MessagePattern(MessagePatterns.boards.create)
  create(@Payload() dto: CreateBoardDto) {
    return this.boardsService.create(dto);
  }

  @MessagePattern(MessagePatterns.boards.update)
  update(@Payload() payload: { id: string; dto: UpdateBoardDto }) {
    return this.boardsService.update(payload.id, payload.dto);
  }

  @MessagePattern(MessagePatterns.boards.remove)
  remove(@Payload() id: string) {
    return this.boardsService.remove(id);
  }
}
