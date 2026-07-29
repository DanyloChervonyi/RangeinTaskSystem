import { ConflictException, Injectable } from "@nestjs/common";
import { safeUserSelect } from "@rangein-task-system/common";
import { PrismaService } from "../../prisma/prisma.service";
import type { CreateUserInput } from "@rangein-task-system/common";

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.user.findMany({
      select: safeUserSelect,
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      select: safeUserSelect,
    });
  }

  findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async create(input: CreateUserInput) {
    const existingUser = await this.findByEmail(input.email);
    if (existingUser)
      throw new ConflictException("User with this email already exists");

    return this.prisma.user.create({
      data: input,
      select: safeUserSelect,
    });
  }
}
