import { Injectable } from "@nestjs/common";
import type { Prisma } from "@prisma/client";
import { ensureFound } from "../../common/prisma/ensure-found";
import {
  taskCreatedAscOrder,
  taskInclude,
} from "../../common/prisma/prisma-includes";
import { RedisService } from "../../infrastructure/redis/redis.service";
import { PrismaService } from "../../prisma/prisma.service";
import { WorkspaceAccessService } from "../workspaces/workspace-access.service";
import type { CreateTaskDto, UpdateTaskDto } from "./dto/task.dto";

type TaskResponse = Prisma.TaskGetPayload<{ include: typeof taskInclude }>;

@Injectable()
export class TasksService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
    private readonly workspaceAccessService: WorkspaceAccessService,
  ) {}

  async findAll(userId: string, boardId?: string) {
    if (boardId) {
      await this.workspaceAccessService.assertBoardWorkspaceAccess(
        userId,
        boardId,
      );
    }

    const cacheKey = `tasks:list:${userId}:${boardId ?? "all"}`;
    const cached = await this.redis.getJson<TaskResponse[]>(cacheKey);
    if (cached) return cached;

    const tasks = await this.prisma.task.findMany({
      where: boardId
        ? { boardId }
        : {
            board: {
              workspace: {
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
            },
          },
      include: taskInclude,
      orderBy: taskCreatedAscOrder,
    });
    await this.redis.setJson(cacheKey, tasks);
    return tasks;
  }

  async findOne(userId: string, id: string) {
    await this.workspaceAccessService.assertTaskWorkspaceAccess(userId, id);

    const cacheKey = `tasks:item:${userId}:${id}`;
    const cached = await this.redis.getJson<TaskResponse>(cacheKey);
    if (cached) return cached;

    const task = await this.prisma.task.findUnique({
      where: { id },
      include: taskInclude,
    });

    const result = ensureFound(task, "Task not found");
    await this.redis.setJson(cacheKey, result);
    return result;
  }

  async create(userId: string, dto: CreateTaskDto) {
    await this.workspaceAccessService.assertBoardWorkspaceOwner(
      userId,
      dto.boardId,
    );

    const task = await this.prisma.task.create({
      data: dto,
      include: taskInclude,
    });
    await this.clearReadCaches();
    return task;
  }

  async update(userId: string, id: string, dto: UpdateTaskDto) {
    await this.workspaceAccessService.assertTaskWorkspaceOwner(userId, id);

    const task = await this.prisma.task.update({
      where: { id },
      data: dto,
      include: taskInclude,
    });
    await this.clearReadCaches();
    return task;
  }

  async remove(userId: string, id: string) {
    await this.workspaceAccessService.assertTaskWorkspaceOwner(userId, id);

    const task = await this.prisma.task.delete({
      where: { id },
      include: taskInclude,
    });
    await this.clearReadCaches();
    return task;
  }

  private async clearReadCaches() {
    await Promise.all([
      this.redis.deleteByPattern("tasks:*"),
      this.redis.deleteByPattern("boards:*"),
      this.redis.deleteByPattern("workspaces:*"),
    ]);
  }
}
