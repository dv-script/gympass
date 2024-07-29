import { CheckIn, Prisma } from "@prisma/client";
import { CheckInRepository } from "../check-in.repository";
import { db } from "@/lib/prisma";

export class PrismaCheckInRepository implements CheckInRepository {
  async create(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn> {
    const checkIn = await db.checkIn.create({
      data,
    });

    return checkIn;
  }
}
