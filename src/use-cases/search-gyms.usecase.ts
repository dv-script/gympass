import { GymRepository } from "@/repositories/gym.repository";
import { Gym } from "@prisma/client";
import { ResourceNotFoundError } from "./errors/resource-not-found.error";

interface SearchGymsCaseRequest {
  query: string;
  page: number;
}

interface SearchGymsUseCaseResponse {
  gyms: Gym[] | null;
}

export class SearchGymsUseCase {
  constructor(private gymRepository: GymRepository) {}

  async execute({
    query,
    page,
  }: SearchGymsCaseRequest): Promise<SearchGymsUseCaseResponse> {
    const gyms = await this.gymRepository.searchMany({ query, page });

    if (gyms?.length === 0) {
      throw new ResourceNotFoundError();
    }

    return { gyms };
  }
}
