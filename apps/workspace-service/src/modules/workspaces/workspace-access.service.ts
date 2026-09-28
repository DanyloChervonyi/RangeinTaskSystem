import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class WorkspaceAccessService {
  constructor(private readonly prisma: PrismaService) {}

  async assertWorkspaceAccess(userId: string, workspaceId: string) {
    const workspace = await this.prisma.workspace.findFirst({
      where: {
        id: workspaceId,
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
      select: {
        id: true,
      },
    });

    if (!workspace)
      await this.throwNotFoundOrForbidden(workspaceId, "Workspace");
  }

  async assertWorkspaceOwner(userId: string, workspaceId: string) {
    const workspace = await this.prisma.workspace.findUnique({
      where: { id: workspaceId },
      select: {
        ownerId: true,
      },
    });

    if (!workspace) throw new NotFoundException("Workspace not found");
    if (workspace.ownerId !== userId)
      throw new ForbiddenException("Workspace owner access required");
  }

  async assertBoardWorkspaceAccess(userId: string, boardId: string) {
    const workspaceId = await this.getBoardWorkspaceId(boardId);
    await this.assertWorkspaceAccess(userId, workspaceId);
  }
  async assertBoardWorkspaceOwner(userId: string, boardId: string) {
    const workspaceId = await this.getBoardWorkspaceId(boardId);
    await this.assertWorkspaceOwner(userId, workspaceId);
  }
  async assertTaskWorkspaceAccess(userId: string, taskId: string) {
    const workspaceId = await this.getTaskWorkspaceId(taskId);
    await this.assertWorkspaceAccess(userId, workspaceId);
  }
  async assertTaskWorkspaceOwner(userId: string, taskId: string) {
    const workspaceId = await this.getTaskWorkspaceId(taskId);
    await this.assertWorkspaceOwner(userId, workspaceId);
  }

  async getBoardWorkspaceId(boardId: string) {
    const board = await this.prisma.board.findUnique({
      where: { id: boardId },
      select: {
        workspaceId: true,
      },
    });

    if (!board) throw new NotFoundException("Board not found");
    return board.workspaceId;
  }

  private async getTaskWorkspaceId(taskId: string) {
    const task = await this.prisma.task.findUnique({
      where: { id: taskId },
      select: {
        board: {
          select: {
            workspaceId: true,
          },
        },
      },
    });
    if (!task) throw new NotFoundException("Task not found");
    return task.board.workspaceId;
  }

  private async throwNotFoundOrForbidden(
    workspaceId: string,
    resource: string,
  ) {
    const exists = await this.prisma.workspace.findUnique({
      where: { id: workspaceId },
      select: {
        id: true,
      },
    });
    if (!exists) throw new NotFoundException(`${resource} not found`);
    throw new ForbiddenException("Workspace access required");
  }
}
