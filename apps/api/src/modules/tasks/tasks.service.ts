import { Injectable } from "@nestjs/common";
import { ensureFound } from "../../common/prisma/ensure-found";
import {
  taskCreatedAscOrder,
  taskInclude,
} from "../../common/prisma/prisma-includes";
import { PrismaService } from "../../prisma/prisma.service";
import { WorkspaceAccessService } from "../workspaces/workspace-access.service";
import type { CreateTaskDto, UpdateTaskDto } from "./dto/task.dto";

@Injectable()
export class TasksService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly workspaceAccessService: WorkspaceAccessService,
  ) {}

  async findAll(userId: string, boardId?: string) {
    if (boardId) {
      await this.workspaceAccessService.assertBoardWorkspaceAccess(
        userId,
        boardId,
      );
    }

    return this.prisma.task.findMany({
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
  }

  async findOne(userId: string, id: string) {
    await this.workspaceAccessService.assertTaskWorkspaceAccess(userId, id);

    const task = await this.prisma.task.findUnique({
      where: { id },
      include: taskInclude,
    });

    return ensureFound(task, "Task not found");
  }

  async create(userId: string, dto: CreateTaskDto) {
    await this.workspaceAccessService.assertBoardWorkspaceOwner(
      userId,
      dto.boardId,
    );

    return this.prisma.task.create({
      data: dto,
      include: taskInclude,
    });
  }

  async update(userId: string, id: string, dto: UpdateTaskDto) {
    await this.workspaceAccessService.assertTaskWorkspaceOwner(userId, id);

    return this.prisma.task.update({
      where: { id },
      data: dto,
      include: taskInclude,
    });
  }

  async remove(userId: string, id: string) {
    await this.workspaceAccessService.assertTaskWorkspaceOwner(userId, id);

    return this.prisma.task.delete({
      where: { id },
      include: taskInclude,
    });
  }
}
