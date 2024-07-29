import { Prisma, CheckIn } from "@prisma/client";

export interface CheckInRepository {
  create(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn>;
  findByUserIdOnDate({ userId, date }: { userId: string, date: Date }): Promise<CheckIn | null>;
}
