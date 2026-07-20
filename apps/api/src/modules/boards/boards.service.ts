import { Injectable } from "@nestjs/common";
import { ensureFound } from "../../common/prisma/ensure-found";
import {
  boardCreatedAscOrder,
  boardInclude,
} from "../../common/prisma/prisma-includes";
import { PrismaService } from "../../prisma/prisma.service";
import type { CreateBoardDto, UpdateBoardDto } from "./dto/board.dto";

@Injectable()
export class BoardsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(userId: string, workspaceId?: string) {
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

  async findOne(id: string) {
    const board = await this.prisma.board.findUnique({
      where: { id },
      include: boardInclude,
    });
    return ensureFound(board, "Board not found");
  }

  create(dto: CreateBoardDto) {
    return this.prisma.board.create({
      data: dto,
      include: boardInclude,
    });
  }

  update(id: string, dto: UpdateBoardDto) {
    return this.prisma.board.update({
      where: { id },
      data: dto,
      include: boardInclude,
    });
  }

  remove(id: string) {
    return this.prisma.board.delete({
      where: { id },
      include: boardInclude,
    });
  }
}
