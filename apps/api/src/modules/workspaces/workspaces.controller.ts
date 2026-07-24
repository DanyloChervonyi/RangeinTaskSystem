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
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { ZodValidationPipe } from "../../common/pipes/zod-validation.pipe";
import { idSchema } from "../../common/schemas/id.schema";
import { MessagePatterns } from "../../infrastructure/rabbitmq/rabbitmq.constants";
import { RabbitmqClientService } from "../../infrastructure/rabbitmq/rabbitmq-client.service";
import type { JwtUser } from "../auth/types/jwt.types";
import {
  addWorkspaceMemberSchema,
  type AddWorkspaceMemberDto,
} from "./dto/workspace-member.dto";
import {
  type CreateWorkspaceDto,
  createWorkspaceSchema,
  type UpdateWorkspaceDto,
  updateWorkspaceSchema,
} from "./dto/workspace.dto";

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
