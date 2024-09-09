import { GymRepository } from "@/repositories/gym.repository";
import { Gym } from "@prisma/client";
import { ResourceNotFoundError } from "./errors/resource-not-found.error";

interface FetchNearbyGymsUseCaseRequest {
  userLatitude: number;
  userLongitude: number;
}

interface FetchNearbyGymsUseCaseResponse {
  gyms: Gym[] | null;
}

export class FetchNearbyGymsUseCase {
  constructor(private gymRepository: GymRepository) {}

  async execute({
    userLatitude,
    userLongitude,
  }: FetchNearbyGymsUseCaseRequest): Promise<FetchNearbyGymsUseCaseResponse> {
    const gyms = await this.gymRepository.findManyNearby({
      latitude: userLatitude,
      longitude: userLongitude,
    });

    if (gyms?.length === 0) {
      throw new ResourceNotFoundError();
    }

    return { gyms };
  }
}
