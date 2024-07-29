import { Gym } from "@prisma/client";
import { GymRepository } from "../gym.repository";
import { db } from "@/lib/prisma";

export class PrismaGymRepository implements GymRepository {
  async create(data: Gym): Promise<Gym> {
    const gym = await db.gym.create({
      data,
    });

    return gym;
  }

  async findById(id: string): Promise<Gym | null> {
    const gym = await db.gym.findUnique({
      where: {
        id,
      },
    });

    return gym;
  }

  async findByTitle(title: string): Promise<Gym | null> {
    const gym = await db.gym.findUnique({
      where: {
        title,
      },
    });

    return gym;
  }
}
