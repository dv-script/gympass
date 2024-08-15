import { Gym, Prisma } from "@prisma/client";
import { randomUUID } from "crypto";
import { GymRepository } from "../gym.repository";
import { Decimal } from "@prisma/client/runtime/library";
import { getDistanceInKilometersBetweenCoordinates } from "@/utils/get-distance-between-coordinates";

export class InMemoryGymRepository implements GymRepository {
  public gyms: Gym[] = [];

  async create(data: Prisma.GymCreateInput): Promise<Gym> {
    const gym: Gym = {
      id: data.id ?? randomUUID(),
      title: data.title,
      description: data.description || null,
      phone: data.phone || null,
      latitude: new Decimal(data.latitude.toString()),
      longitude: new Decimal(data.longitude.toString()),
    };

    this.gyms.push(gym);

    return gym;
  }

  async findById(id: string): Promise<Gym | null> {
    return this.gyms.find((gym) => gym.id === id) || null;
  }

  async findByTitle(title: string): Promise<Gym | null> {
    return this.gyms.find((gym) => gym.title === title) || null;
  }

  async searchMany({
    query,
    page,
  }: {
    query: string;
    page: number;
  }): Promise<Gym[] | null> {
    return this.gyms
      .filter((gym) => gym.title.includes(query))
      .slice((page - 1) * 20, page * 20);
  }

  async findManyNearby({
    latitude,
    longitude,
  }: {
    latitude: number;
    longitude: number;
  }): Promise<Gym[] | null> {
    return this.gyms.filter((gym) => {
      const distance = getDistanceInKilometersBetweenCoordinates({
        from: { latitude, longitude },
        to: {
          latitude: gym.latitude.toNumber(),
          longitude: gym.longitude.toNumber(),
        },
      });

      return distance <= 10;
    });
  }
}
