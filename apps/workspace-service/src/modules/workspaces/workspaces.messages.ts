import { Controller, UseFilters } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { MessagePatterns } from "@rangein-task-system/common";
import { RabbitmqHttpExceptionFilter } from "@rangein-task-system/common";
import type { AddWorkspaceMemberDto } from "@rangein-task-system/common";
import type {
  CreateWorkspaceDto,
  UpdateWorkspaceDto,
} from "@rangein-task-system/common";
import { WorkspacesService } from "./workspaces.service";

@Controller()
@UseFilters(new RabbitmqHttpExceptionFilter())
export class WorkspacesMessages {
  constructor(private readonly workspacesService: WorkspacesService) {}

  @MessagePattern(MessagePatterns.workspaces.findAll)
  findAll(@Payload() payload: { userId: string }) {
    return this.workspacesService.findAll(payload.userId);
  }

  @MessagePattern(MessagePatterns.workspaces.findOne)
  findOne(@Payload() payload: { userId: string; id: string }) {
    return this.workspacesService.findOne(payload.userId, payload.id);
  }

  @MessagePattern(MessagePatterns.workspaces.create)
  create(@Payload() payload: { userId: string; dto: CreateWorkspaceDto }) {
    return this.workspacesService.create(payload.userId, payload.dto);
  }

  @MessagePattern(MessagePatterns.workspaces.update)
  update(
    @Payload() payload: { userId: string; id: string; dto: UpdateWorkspaceDto },
  ) {
    return this.workspacesService.update(payload.userId, payload.id, payload.dto);
  }

  @MessagePattern(MessagePatterns.workspaces.remove)
  remove(@Payload() payload: { userId: string; id: string }) {
    return this.workspacesService.remove(payload.userId, payload.id);
  }

  @MessagePattern(MessagePatterns.workspaces.findMembers)
  findMembers(@Payload() payload: { userId: string; id: string }) {
    return this.workspacesService.findMembers(payload.userId, payload.id);
  }

  @MessagePattern(MessagePatterns.workspaces.addMember)
  addMember(
    @Payload()
    payload: {
      userId: string;
      workspaceId: string;
      dto: AddWorkspaceMemberDto;
    },
  ) {
    return this.workspacesService.addMember(
      payload.userId,
      payload.workspaceId,
      payload.dto,
    );
  }
}
