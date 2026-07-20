import {
  type CanActivate,
  type ExecutionContext,
  Injectable,
} from "@nestjs/common";
import type { Request } from "express";
import type { JwtUser } from "../../modules/auth/types/jwt.types";
import { WorkspaceAccessService } from "../../modules/workspaces/workspace-access.service";

interface AuthenticatedRequest extends Request {
  user: JwtUser;
}

@Injectable()
export class BoardListAccessGuard implements CanActivate {
  constructor(
    private readonly workspaceAccessService: WorkspaceAccessService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const workspaceId = request.query.workspaceId;
    if (typeof workspaceId === "string") {
      await this.workspaceAccessService.assertWorkspaceAccess(
        request.user.id,
        workspaceId,
      );
    }
    return true;
  }
}

@Injectable()
export class BoardReadAccessGuard implements CanActivate {
  constructor(
    private readonly workspaceAccessService: WorkspaceAccessService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const boardId = request.params.id;
    if (typeof boardId === "string") {
      await this.workspaceAccessService.assertBoardWorkspaceAccess(
        request.user.id,
        boardId,
      );
    }
    return true;
  }
}

@Injectable()
export class BoardCreateOwnerGuard implements CanActivate {
  constructor(
    private readonly workspaceAccessService: WorkspaceAccessService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const workspaceId = request.body?.workspaceId;
    if (typeof workspaceId === "string") {
      await this.workspaceAccessService.assertWorkspaceOwner(
        request.user.id,
        workspaceId,
      );
    }
    return true;
  }
}

@Injectable()
export class BoardOwnerGuard implements CanActivate {
  constructor(
    private readonly workspaceAccessService: WorkspaceAccessService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const boardId = request.params.id;
    if (typeof boardId === "string") {
      await this.workspaceAccessService.assertBoardWorkspaceOwner(
        request.user.id,
        boardId,
      );
    }
    return true;
  }
}
