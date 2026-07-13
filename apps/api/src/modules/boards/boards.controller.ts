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
import { BoardsService } from "./boards.service";
import {
  type CreateBoardDto,
  createBoardSchema,
  type UpdateBoardDto,
  updateBoardSchema,
} from "./dto/board.dto";

@Controller("boards")
@UseGuards(JwtAuthGuard)
export class BoardsController {
  constructor(private readonly boardsService: BoardsService) {}

  @Get()
  findAll(
    @CurrentUser() user: JwtUser,
    @Query("workspaceId", new ZodValidationPipe(optionalIdSchema))
    workspaceId?: string,
  ) {
    return this.boardsService.findAll(user.id, workspaceId);
  }

  @Get(":id")
  findOne(
    @CurrentUser() user: JwtUser,
    @Param("id", new ZodValidationPipe(idSchema)) id: string,
  ) {
    return this.boardsService.findOne(user.id, id);
  }

  @Post()
  create(
    @CurrentUser() user: JwtUser,
    @Body(new ZodValidationPipe(createBoardSchema)) createBoardDto: CreateBoardDto,
  ) {
    return this.boardsService.create(user.id, createBoardDto);
  }

  @Patch(":id")
  update(
    @CurrentUser() user: JwtUser,
    @Param("id", new ZodValidationPipe(idSchema)) id: string,
    @Body(new ZodValidationPipe(updateBoardSchema)) updateBoardDto: UpdateBoardDto,
  ) {
    return this.boardsService.update(user.id, id, updateBoardDto);
  }

  @Delete(":id")
  remove(
    @CurrentUser() user: JwtUser,
    @Param("id", new ZodValidationPipe(idSchema)) id: string,
  ) {
    return this.boardsService.remove(user.id, id);
  }
}
