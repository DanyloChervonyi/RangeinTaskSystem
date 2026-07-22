import { Injectable, NotFoundException } from "@nestjs/common";
import type { Prisma } from "@prisma/client";
import { ensureFound } from "../../common/prisma/ensure-found";
import {
  workspaceInclude,
  workspaceMemberInclude,
} from "../../common/prisma/prisma-includes";
import { PrismaService } from "../../prisma/prisma.service";
import type { AddWorkspaceMemberDto } from "./dto/workspace-member.dto";
import type {
  CreateWorkspaceDto,
  UpdateWorkspaceDto,
} from "./dto/workspace.dto";
import { WorkspaceAccessService } from "./workspace-access.service";

type WorkspaceWithBoardsAndTasks = Awaited<
  Prisma.WorkspaceGetPayload<{ include: typeof workspaceInclude }>
>;

@Injectable()
export class WorkspacesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly workspaceAccessService: WorkspaceAccessService,
  ) {}

  async findAll(userId: string) {
    const workspaces = await this.prisma.workspace.findMany({
      where: {
        OR: [
          { ownerId: userId },
          {
            members: {
              some: {
                userId,
              },
            },
          },
        ],
      },
      include: workspaceInclude,
      orderBy: {
        createdAt: "desc",
      },
    });
    return workspaces.map((workspace) => this.addTasksCount(workspace));
  }

  async findOne(userId: string, id: string) {
    await this.workspaceAccessService.assertWorkspaceAccess(userId, id);
    const workspace = await this.prisma.workspace.findUnique({
      where: { id },
      include: workspaceInclude,
    });
    return this.addTasksCount(ensureFound(workspace, "Workspace not found"));
  }

  async create(userId: string, dto: CreateWorkspaceDto) {
    const workspace = await this.prisma.workspace.create({
      data: {
        name: dto.name,
        ownerId: userId,
        members: {
          create: {
            userId,
            role: "OWNER",
          },
        },
      },
      include: workspaceInclude,
    });
    return this.addTasksCount(workspace);
  }

  async update(userId: string, id: string, dto: UpdateWorkspaceDto) {
    await this.workspaceAccessService.assertWorkspaceOwner(userId, id);
    const workspace = await this.prisma.workspace.update({
      where: { id },
      data: dto,
      include: workspaceInclude,
    });
    return this.addTasksCount(workspace);
  }

  async remove(userId: string, id: string) {
    await this.workspaceAccessService.assertWorkspaceOwner(userId, id);
    const workspace = await this.prisma.workspace.delete({
      where: { id },
      include: workspaceInclude,
    });
    return this.addTasksCount(workspace);
  }

  async findMembers(userId: string, workspaceId: string) {
    await this.workspaceAccessService.assertWorkspaceAccess(
      userId,
      workspaceId,
    );
    return this.prisma.workspaceMember.findMany({
      where: { workspaceId },
      include: workspaceMemberInclude,
      orderBy: {
        createdAt: "asc",
      },
    });
  }

  async addMember(
    ownerId: string,
    workspaceId: string,
    dto: AddWorkspaceMemberDto,
  ) {
    await this.workspaceAccessService.assertWorkspaceOwner(
      ownerId,
      workspaceId,
    );

    const user = dto.userId
      ? await this.prisma.user.findUnique({
          where: { id: dto.userId },
          select: { id: true },
        })
      : await this.prisma.user.findUnique({
          where: { email: dto.email },
          select: { id: true },
        });
    if (!user) throw new NotFoundException("User not found");
    return this.prisma.workspaceMember.upsert({
      where: {
        workspaceId_userId: {
          workspaceId,
          userId: user.id,
        },
      },
      update: {},
      create: {
        workspaceId,
        userId: user.id,
        role: "MEMBER",
      },
      include: workspaceMemberInclude,
    });
  }

  private addTasksCount(workspace: WorkspaceWithBoardsAndTasks) {
    return {
      ...workspace,
      tasksCount: workspace.boards.reduce(
        (tasksCount, board) => tasksCount + board.tasks.length,
        0,
      ),
    };
  }
}
