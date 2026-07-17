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
import { WorkspacesService } from "./workspaces.service";

@Controller(["workspaces", "workspace"])
@UseGuards(JwtAuthGuard)
export class WorkspacesController {
  constructor(private readonly workspacesService: WorkspacesService) {}

  @Get()
  findAll(@CurrentUser() user: JwtUser) {
    return this.workspacesService.findAll(user.id);
  }

  @Get(":id")
  findOne(
    @CurrentUser() user: JwtUser,
    @Param("id", new ZodValidationPipe(idSchema)) id: string,
  ) {
    return this.workspacesService.findOne(user.id, id);
  }

  @Post()
  create(
    @CurrentUser() user: JwtUser,
    @Body(new ZodValidationPipe(createWorkspaceSchema))
    createWorkspaceDto: CreateWorkspaceDto,
  ) {
    return this.workspacesService.create(user.id, createWorkspaceDto);
  }

  @Patch(":id")
  update(
    @CurrentUser() user: JwtUser,
    @Param("id", new ZodValidationPipe(idSchema)) id: string,
    @Body(new ZodValidationPipe(updateWorkspaceSchema))
    updateWorkspaceDto: UpdateWorkspaceDto,
  ) {
    return this.workspacesService.update(user.id, id, updateWorkspaceDto);
  }

  @Delete(":id")
  remove(
    @CurrentUser() user: JwtUser,
    @Param("id", new ZodValidationPipe(idSchema)) id: string,
  ) {
    return this.workspacesService.remove(user.id, id);
  }

  @Get(":id/members")
  findMembers(
    @CurrentUser() user: JwtUser,
    @Param("id", new ZodValidationPipe(idSchema)) id: string,
  ) {
    return this.workspacesService.findMembers(user.id, id);
  }

  @Post(":id/members")
  addMember(
    @CurrentUser() user: JwtUser,
    @Param("id", new ZodValidationPipe(idSchema)) id: string,
    @Body(new ZodValidationPipe(addWorkspaceMemberSchema))
    addWorkspaceMemberDto: AddWorkspaceMemberDto,
  ) {
    return this.workspacesService.addMember(
      user.id,
      id,
      addWorkspaceMemberDto,
    );
  }
}
