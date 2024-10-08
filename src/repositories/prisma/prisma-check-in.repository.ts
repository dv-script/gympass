import { CheckIn, Prisma } from "@prisma/client";
import { CheckInRepository } from "../check-in.repository";
import { db } from "@/lib/prisma";
import dayjs from "dayjs";

export class PrismaCheckInRepository implements CheckInRepository {
  async create(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn> {
    const checkIn = await db.checkIn.create({
      data,
    });

    return checkIn;
  }

  async update(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn> {
    const checkIn = await db.checkIn.update({
      where: {
        id: data.id,
      },
      data,
    });

    return checkIn;
  }

  async findByUserIdOnDate({
    userId,
    date,
  }: {
    userId: string;
    date: Date;
  }): Promise<CheckIn | null> {
    const checkInOnSameDay = await db.checkIn.findFirst({
      where: {
        user_id: userId,
        created_at: {
          gte: date,
          lt: dayjs(date).add(1, "day").toDate(),
        },
      },
    });

    if (!checkInOnSameDay) {
      return null;
    }

    return checkInOnSameDay;
  }

  async findById(id: string): Promise<CheckIn | null> {
    const checkIn = await db.checkIn.findUnique({
      where: {
        id,
      },
    });

    return checkIn;
  }

  async findManyByUserId({
    userId,
    page,
  }: {
    userId: string;
    page: number;
  }): Promise<CheckIn[]> {
    const checkIns = await db.checkIn.findMany({
      where: {
        user_id: userId,
      },
      skip: (page - 1) * 20,
      take: 20,
    });

    return checkIns;
  }

  async countByUserId({ userId }: { userId: string }): Promise<number> {
    const count = await db.checkIn.count({
      where: {
        user_id: userId,
      },
    });

    return count;
  }
}
