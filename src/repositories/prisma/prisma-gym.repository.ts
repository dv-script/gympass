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

  async searchMany({ query, page, }: { query: string; page: number; }): Promise<Gym[] | null> {
    const gyms = await db.gym.findMany({
      where: {
        title: {
          contains: query,
        },
      },
      skip: page * 10,
      take: 10,
    });

    return gyms;
  }

  async findManyNearby({ latitude, longitude }: { latitude: number; longitude: number; }): Promise<Gym[] | null> {
    const gyms = await db.gym.findMany({
      where: {
        latitude: {
          lte: latitude + 0.1,
          gte: latitude - 0.1,
        },
        longitude: {
          lte: longitude + 0.1,
          gte: longitude - 0.1,
        },
      },
    });

    return gyms;
  }
}
