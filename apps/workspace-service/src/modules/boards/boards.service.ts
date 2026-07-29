import { Injectable } from "@nestjs/common";
import type { Prisma } from "@prisma/client";
import { ensureFound } from "@rangein-task-system/common";
import {
  boardCreatedAscOrder,
  boardInclude,
} from "@rangein-task-system/common";
import { RedisService } from "../../infrastructure/redis/redis.service";
import { PrismaService } from "../../prisma/prisma.service";
import { WorkspaceAccessService } from "../workspaces/workspace-access.service";
import type { CreateBoardDto, UpdateBoardDto } from "@rangein-task-system/common";

type BoardResponse = Prisma.BoardGetPayload<{ include: typeof boardInclude }>;

@Injectable()
export class BoardsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
    private readonly workspaceAccessService: WorkspaceAccessService,
  ) {}

  async findAll(userId: string, workspaceId?: string) {
    if (workspaceId) {
      await this.workspaceAccessService.assertWorkspaceAccess(
        userId,
        workspaceId,
      );
    }

    const cacheKey = `boards:list:${userId}:${workspaceId ?? "all"}`;
    const cached = await this.redis.getJson<BoardResponse[]>(cacheKey);
    if (cached) return cached;

    const boards = await this.prisma.board.findMany({
      where: workspaceId
        ? { workspaceId }
        : {
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
      include: boardInclude,
      orderBy: boardCreatedAscOrder,
    });
    await this.redis.setJson(cacheKey, boards);
    return boards;
  }

  async findOne(userId: string, id: string) {
    await this.workspaceAccessService.assertBoardWorkspaceAccess(userId, id);

    const cacheKey = `boards:item:${id}`;
    const cached = await this.redis.getJson<BoardResponse>(cacheKey);
    if (cached) return cached;

    const board = await this.prisma.board.findUnique({
      where: { id },
      include: boardInclude,
    });
    const result = ensureFound(board, "Board not found");
    await this.redis.setJson(cacheKey, result);
    return result;
  }

  async create(userId: string, dto: CreateBoardDto) {
    await this.workspaceAccessService.assertWorkspaceOwner(
      userId,
      dto.workspaceId,
    );

    const board = await this.prisma.board.create({
      data: dto,
      include: boardInclude,
    });
    await this.clearBoardsCache();
    return board;
  }

  async update(userId: string, id: string, dto: UpdateBoardDto) {
    await this.workspaceAccessService.assertBoardWorkspaceOwner(userId, id);

    const board = await this.prisma.board.update({
      where: { id },
      data: dto,
      include: boardInclude,
    });
    await this.clearBoardsCache();
    return board;
  }

  async remove(userId: string, id: string) {
    await this.workspaceAccessService.assertBoardWorkspaceOwner(userId, id);

    const board = await this.prisma.board.delete({
      where: { id },
      include: boardInclude,
    });
    await this.clearBoardsCache();
    return board;
  }

  private clearBoardsCache() {
    return Promise.all([
      this.redis.deleteByPattern("boards:*"),
      this.redis.deleteByPattern("tasks:*"),
      this.redis.deleteByPattern("workspaces:*"),
    ]);
  }
}
