import { Injectable, NotFoundException } from "@nestjs/common";
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

@Injectable()
export class WorkspacesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly workspaceAccessService: WorkspaceAccessService,
  ) {}

  findAll(userId: string) {
    return this.prisma.workspace.findMany({
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
  }

  async findOne(userId: string, id: string) {
    await this.workspaceAccessService.assertWorkspaceAccess(userId, id);

    const workspace = await this.prisma.workspace.findUnique({
      where: { id },
      include: workspaceInclude,
    });
    return ensureFound(workspace, "Workspace not found");
  }

  create(userId: string, dto: CreateWorkspaceDto) {
    return this.prisma.workspace.create({
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
  }

  async update(userId: string, id: string, dto: UpdateWorkspaceDto) {
    await this.workspaceAccessService.assertWorkspaceOwner(userId, id);

    return this.prisma.workspace.update({
      where: { id },
      data: dto,
      include: workspaceInclude,
    });
  }

  async remove(userId: string, id: string) {
    await this.workspaceAccessService.assertWorkspaceOwner(userId, id);

    return this.prisma.workspace.delete({
      where: { id },
      include: workspaceInclude,
    });
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

    if (!user) {
      throw new NotFoundException("User not found");
    }

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
}
