import { db } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { UserRepository } from "../user.repository";

export class PrismaUserRepository implements UserRepository {
  async create(data: Prisma.UserCreateInput) {
    const user = await db.user.create({
      data,
    });

    return user;
  }

  async findByEmail(email: string) {
    const user = await db.user.findUnique({
      where: {
        email,
      },
    });

    return user;
  }
}
