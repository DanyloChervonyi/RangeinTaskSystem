import { Injectable } from "@nestjs/common";
import { ensureFound } from "../../common/prisma/ensure-found";
import {
  boardCreatedAscOrder,
  boardInclude,
} from "../../common/prisma/prisma-includes";
import { PrismaService } from "../../prisma/prisma.service";
import { WorkspaceAccessService } from "../workspaces/workspace-access.service";
import type { CreateBoardDto, UpdateBoardDto } from "./dto/board.dto";

@Injectable()
export class BoardsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly workspaceAccessService: WorkspaceAccessService,
  ) {}

  async findAll(userId: string, workspaceId?: string) {
    if (workspaceId) {
      await this.workspaceAccessService.assertWorkspaceAccess(
        userId,
        workspaceId,
      );
    }

    return this.prisma.board.findMany({
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
  }

  async findOne(userId: string, id: string) {
    await this.workspaceAccessService.assertBoardWorkspaceAccess(userId, id);

    const board = await this.prisma.board.findUnique({
      where: { id },
      include: boardInclude,
    });
    return ensureFound(board, "Board not found");
  }

  async create(userId: string, dto: CreateBoardDto) {
    await this.workspaceAccessService.assertWorkspaceOwner(
      userId,
      dto.workspaceId,
    );

    return this.prisma.board.create({
      data: dto,
      include: boardInclude,
    });
  }

  async update(userId: string, id: string, dto: UpdateBoardDto) {
    await this.workspaceAccessService.assertBoardWorkspaceOwner(userId, id);

    return this.prisma.board.update({
      where: { id },
      data: dto,
      include: boardInclude,
    });
  }

  async remove(userId: string, id: string) {
    await this.workspaceAccessService.assertBoardWorkspaceOwner(userId, id);

    return this.prisma.board.delete({
      where: { id },
      include: boardInclude,
    });
  }
}
