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
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { ZodValidationPipe } from "../../common/pipes/zod-validation.pipe";
import { idSchema, optionalIdSchema } from "../../common/schemas/id.schema";
import type { JwtUser } from "../auth/types/jwt.types";
import {
  BoardCreateOwnerGuard,
  BoardListAccessGuard,
  BoardOwnerGuard,
  BoardReadAccessGuard,
} from "../../common/guards/boards-access.guards";
import { BoardsService } from "./boards.service";
import {
  type CreateBoardDto,
  createBoardSchema,
  type UpdateBoardDto,
  updateBoardSchema,
} from "./dto/board.dto";

@Controller(["boards", "board"])
@UseGuards(JwtAuthGuard)
export class BoardsController {
  constructor(private readonly boardsService: BoardsService) {}

  @Get()
  @UseGuards(BoardListAccessGuard)
  findAll(
    @CurrentUser() user: JwtUser,
    @Query("workspaceId", new ZodValidationPipe(optionalIdSchema))
    workspaceId?: string,
  ) {
    return this.boardsService.findAll(user.id, workspaceId);
  }

  @Get(":id")
  @UseGuards(BoardReadAccessGuard)
  findOne(@Param("id", new ZodValidationPipe(idSchema)) id: string) {
    return this.boardsService.findOne(id);
  }

  @Post()
  @UseGuards(BoardCreateOwnerGuard)
  create(
    @Body(new ZodValidationPipe(createBoardSchema))
    createBoardDto: CreateBoardDto,
  ) {
    return this.boardsService.create(createBoardDto);
  }

  @Patch(":id")
  @UseGuards(BoardOwnerGuard)
  update(
    @Param("id", new ZodValidationPipe(idSchema)) id: string,
    @Body(new ZodValidationPipe(updateBoardSchema))
    updateBoardDto: UpdateBoardDto,
  ) {
    return this.boardsService.update(id, updateBoardDto);
  }

  @Delete(":id")
  @UseGuards(BoardOwnerGuard)
  remove(@Param("id", new ZodValidationPipe(idSchema)) id: string) {
    return this.boardsService.remove(id);
  }
}
