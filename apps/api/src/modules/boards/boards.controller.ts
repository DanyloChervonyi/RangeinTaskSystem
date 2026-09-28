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
import type { JwtUser } from "@rangein-task-system/common";
import { MessagePatterns } from "@rangein-task-system/common";
import { RabbitmqClientService } from "../../infrastructure/rabbitmq/rabbitmq-client.service";
import {
  type CreateBoardDto,
  createBoardSchema,
  type UpdateBoardDto,
  updateBoardSchema,
} from "@rangein-task-system/common";

@Controller(["boards", "board"])
@UseGuards(JwtAuthGuard)
export class BoardsController {
  constructor(private readonly rabbitmqClient: RabbitmqClientService) {}

  @Get()
  findAll(
    @CurrentUser() user: JwtUser,
    @Query("workspaceId", new ZodValidationPipe(optionalIdSchema))
    workspaceId?: string,
  ) {
    return this.rabbitmqClient.request(MessagePatterns.boards.findAll, {
      userId: user.id,
      workspaceId,
    });
  }

  @Get(":id")
  findOne(
    @CurrentUser() user: JwtUser,
    @Param("id", new ZodValidationPipe(idSchema)) id: string,
  ) {
    return this.rabbitmqClient.request(MessagePatterns.boards.findOne, {
      userId: user.id,
      id,
    });
  }

  @Post()
  create(
    @CurrentUser() user: JwtUser,
    @Body(new ZodValidationPipe(createBoardSchema))
    createBoardDto: CreateBoardDto,
  ) {
    return this.rabbitmqClient.request(MessagePatterns.boards.create, {
      userId: user.id,
      dto: createBoardDto,
    });
  }

  @Patch(":id")
  update(
    @CurrentUser() user: JwtUser,
    @Param("id", new ZodValidationPipe(idSchema)) id: string,
    @Body(new ZodValidationPipe(updateBoardSchema))
    updateBoardDto: UpdateBoardDto,
  ) {
    return this.rabbitmqClient.request(MessagePatterns.boards.update, {
      userId: user.id,
      id,
      dto: updateBoardDto,
    });
  }

  @Delete(":id")
  remove(
    @CurrentUser() user: JwtUser,
    @Param("id", new ZodValidationPipe(idSchema)) id: string,
  ) {
    return this.rabbitmqClient.request(MessagePatterns.boards.remove, {
      userId: user.id,
      id,
    });
  }
}
