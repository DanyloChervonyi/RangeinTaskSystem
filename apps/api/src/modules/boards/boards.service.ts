import { Injectable } from "@nestjs/common";
import type { Prisma } from "@prisma/client";
import { ensureFound } from "../../common/prisma/ensure-found";
import {
  boardCreatedAscOrder,
  boardInclude,
} from "../../common/prisma/prisma-includes";
import { RedisService } from "../../infrastructure/redis/redis.service";
import { PrismaService } from "../../prisma/prisma.service";
import type { CreateBoardDto, UpdateBoardDto } from "./dto/board.dto";

type BoardResponse = Prisma.BoardGetPayload<{ include: typeof boardInclude }>;

@Injectable()
export class BoardsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  async findAll(userId: string, workspaceId?: string) {
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

  async findOne(id: string) {
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

  async create(dto: CreateBoardDto) {
    const board = await this.prisma.board.create({
      data: dto,
      include: boardInclude,
    });
    await this.clearBoardsCache();
    return board;
  }

  async update(id: string, dto: UpdateBoardDto) {
    const board = await this.prisma.board.update({
      where: { id },
      data: dto,
      include: boardInclude,
    });
    await this.clearBoardsCache();
    return board;
  }

  async remove(id: string) {
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
