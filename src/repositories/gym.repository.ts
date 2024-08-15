import { Prisma, Gym } from "@prisma/client";

export interface GymRepository {
  create(data: Prisma.GymCreateInput): Promise<Gym>;
  findById(id: string): Promise<Gym | null>;
  findByTitle(title: string): Promise<Gym | null>;
  searchMany({
    query,
    page,
  }: {
    query: string;
    page: number;
  }): Promise<Gym[] | null>;
  findManyNearby({ latitude, longitude }: { latitude: number; longitude: number }): Promise<Gym[] | null>;
}
