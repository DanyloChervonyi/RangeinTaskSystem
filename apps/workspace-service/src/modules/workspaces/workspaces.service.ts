import { Injectable, NotFoundException } from "@nestjs/common";
import type { Prisma } from "@prisma/client";
import { ensureFound } from "../../common/prisma/ensure-found";
import {
  workspaceInclude,
  workspaceMemberInclude,
} from "../../common/prisma/prisma-includes";
import { RedisService } from "../../infrastructure/redis/redis.service";
import { PrismaService } from "../../prisma/prisma.service";
import type { AddWorkspaceMemberDto } from "@rangein-task-system/common";
import type {
  CreateWorkspaceDto,
  UpdateWorkspaceDto,
} from "@rangein-task-system/common";
import { WorkspaceAccessService } from "./workspace-access.service";

type WorkspaceWithBoardsAndTasks = Awaited<
  Prisma.WorkspaceGetPayload<{ include: typeof workspaceInclude }>
>;

type WorkspaceResponse = WorkspaceWithBoardsAndTasks & { tasksCount: number };

@Injectable()
export class WorkspacesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
    private readonly workspaceAccessService: WorkspaceAccessService,
  ) {}

  async findAll(userId: string) {
    const cacheKey = `workspaces:list:${userId}`;
    const cached = await this.redis.getJson<WorkspaceResponse[]>(cacheKey);
    if (cached) return cached;

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
    const result = workspaces.map((workspace) => this.addTasksCount(workspace));
    await this.redis.setJson(cacheKey, result);
    return result;
  }

  async findOne(userId: string, id: string) {
    await this.workspaceAccessService.assertWorkspaceAccess(userId, id);
    const cacheKey = `workspaces:item:${userId}:${id}`;
    const cached = await this.redis.getJson<WorkspaceResponse>(cacheKey);
    if (cached) return cached;

    const workspace = await this.prisma.workspace.findUnique({
      where: { id },
      include: workspaceInclude,
    });
    const result = this.addTasksCount(ensureFound(workspace, "Workspace not found"));
    await this.redis.setJson(cacheKey, result);
    return result;
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
    await this.clearWorkspaceCache();
    return this.addTasksCount(workspace);
  }

  async update(userId: string, id: string, dto: UpdateWorkspaceDto) {
    await this.workspaceAccessService.assertWorkspaceOwner(userId, id);
    const workspace = await this.prisma.workspace.update({
      where: { id },
      data: dto,
      include: workspaceInclude,
    });
    await this.clearWorkspaceCache();
    return this.addTasksCount(workspace);
  }

  async remove(userId: string, id: string) {
    await this.workspaceAccessService.assertWorkspaceOwner(userId, id);
    const workspace = await this.prisma.workspace.delete({
      where: { id },
      include: workspaceInclude,
    });
    await this.clearWorkspaceCache();
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
    const member = await this.prisma.workspaceMember.upsert({
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
    await this.clearWorkspaceCache();
    return member;
  }

  private addTasksCount(workspace: WorkspaceWithBoardsAndTasks): WorkspaceResponse {
    return {
      ...workspace,
      tasksCount: workspace.boards.reduce(
        (tasksCount, board) => tasksCount + board.tasks.length,
        0,
      ),
    };
  }

  private clearWorkspaceCache() {
    return Promise.all([
      this.redis.deleteByPattern("workspaces:*"),
      this.redis.deleteByPattern("boards:*"),
      this.redis.deleteByPattern("tasks:*"),
    ]);
  }
}
