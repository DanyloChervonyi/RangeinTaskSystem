import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import { CurrentUser } from "@rangein-task-system/common";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { ZodValidationPipe } from "@rangein-task-system/common";
import { idSchema } from "@rangein-task-system/common";
import { MessagePatterns } from "@rangein-task-system/common";
import { RabbitmqClientService } from "../../infrastructure/rabbitmq/rabbitmq-client.service";
import type { JwtUser } from "@rangein-task-system/common";
import {
  addWorkspaceMemberSchema,
  type AddWorkspaceMemberDto,
} from "@rangein-task-system/common";
import {
  type CreateWorkspaceDto,
  createWorkspaceSchema,
  type UpdateWorkspaceDto,
  updateWorkspaceSchema,
} from "@rangein-task-system/common";

@Controller(["workspaces", "workspace"])
@UseGuards(JwtAuthGuard)
export class WorkspacesController {
  constructor(private readonly rabbitmqClient: RabbitmqClientService) {}

  @Get()
  findAll(@CurrentUser() user: JwtUser) {
    return this.rabbitmqClient.request(MessagePatterns.workspaces.findAll, {
      userId: user.id,
    });
  }

  @Get(":id")
  findOne(
    @CurrentUser() user: JwtUser,
    @Param("id", new ZodValidationPipe(idSchema)) id: string,
  ) {
    return this.rabbitmqClient.request(MessagePatterns.workspaces.findOne, {
      userId: user.id,
      id,
    });
  }

  @Post()
  create(
    @CurrentUser() user: JwtUser,
    @Body(new ZodValidationPipe(createWorkspaceSchema))
    createWorkspaceDto: CreateWorkspaceDto,
  ) {
    return this.rabbitmqClient.request(MessagePatterns.workspaces.create, {
      userId: user.id,
      dto: createWorkspaceDto,
    });
  }

  @Patch(":id")
  update(
    @CurrentUser() user: JwtUser,
    @Param("id", new ZodValidationPipe(idSchema)) id: string,
    @Body(new ZodValidationPipe(updateWorkspaceSchema))
    updateWorkspaceDto: UpdateWorkspaceDto,
  ) {
    return this.rabbitmqClient.request(MessagePatterns.workspaces.update, {
      userId: user.id,
      id,
      dto: updateWorkspaceDto,
    });
  }

  @Delete(":id")
  remove(
    @CurrentUser() user: JwtUser,
    @Param("id", new ZodValidationPipe(idSchema)) id: string,
  ) {
    return this.rabbitmqClient.request(MessagePatterns.workspaces.remove, {
      userId: user.id,
      id,
    });
  }

  @Get(":id/members")
  findMembers(
    @CurrentUser() user: JwtUser,
    @Param("id", new ZodValidationPipe(idSchema)) id: string,
  ) {
    return this.rabbitmqClient.request(MessagePatterns.workspaces.findMembers, {
      userId: user.id,
      id,
    });
  }

  @Post(":id/members")
  addMember(
    @CurrentUser() user: JwtUser,
    @Param("id", new ZodValidationPipe(idSchema)) id: string,
    @Body(new ZodValidationPipe(addWorkspaceMemberSchema))
    addWorkspaceMemberDto: AddWorkspaceMemberDto,
  ) {
    return this.rabbitmqClient.request(MessagePatterns.workspaces.addMember, {
      userId: user.id,
      workspaceId: id,
      dto: addWorkspaceMemberDto,
    });
  }
}
