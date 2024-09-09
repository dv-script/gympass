import { CheckIn, Prisma } from "@prisma/client";
import { CheckInRepository } from "../check-in.repository";
import { randomUUID } from "crypto";
import dayjs from "dayjs";

export class InMemoryCheckInRepository implements CheckInRepository {
  public checkIns: CheckIn[] = [];

  async create(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn> {
    const checkIn: CheckIn = {
      id: randomUUID(),
      gym_id: data.gym_id,
      user_id: data.user_id,
      created_at: new Date(),
      validated_at: data.validated_at ? new Date(data.validated_at) : null,
    };

    this.checkIns.push(checkIn);

    return checkIn;
  }

  async update(data: CheckIn): Promise<CheckIn> {
    const checkIn = this.checkIns.findIndex(
      (checkIn) => checkIn.id === data.id
    );

    if (checkIn >= 0) {
      this.checkIns[checkIn] = data;
    }

    return data;
  }

  async findById(id: string): Promise<CheckIn | null> {
    return this.checkIns.find((checkIn) => checkIn.id === id) || null;
  }

  async findByUserIdOnDate({
    userId,
    date,
  }: {
    userId: string;
    date: Date;
  }): Promise<CheckIn | null> {
    const startOfDay = dayjs(date).startOf("date");
    const endOfDay = dayjs(date).endOf("date");

    const checkInOnSameDay = this.checkIns.find((checkIn) => {
      const checkInDate = dayjs(checkIn.created_at);
      const isOnSameDate =
        checkInDate.isAfter(startOfDay) && checkInDate.isBefore(endOfDay);

      return checkIn.user_id === userId && isOnSameDate;
    });

    if (!checkInOnSameDay) {
      return null;
    }

    return checkInOnSameDay;
  }

  async findManyByUserId({
    userId,
    page,
  }: {
    userId: string;
    page: number;
  }): Promise<CheckIn[]> {
    return this.checkIns
      .filter((checkIn) => checkIn.user_id === userId)
      .slice((page - 1) * 20, page * 20);
  }

  async countByUserId({ userId }: { userId: string }): Promise<number> {
    return this.checkIns.filter((checkIn) => checkIn.user_id === userId).length;
  }
}
