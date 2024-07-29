import { GymRepository } from "@/repositories/gym.repository";
import { GymAlreadyExistsError } from "./errors/gym-already-exists.error";
import { Gym } from "@prisma/client";

interface GymUseCaseRequest {
  title: string;
  description: string | null;
  phone: string | null;
  latitude: number;
  longitude: number;
}

interface GymUseCaseResponse {
  gym: Gym;
}

export class CreateGymUseCase {
  constructor(private gymRepository: GymRepository) {}

  async execute({
    title,
    description,
    phone,
    latitude,
    longitude,
  }: GymUseCaseRequest): Promise<GymUseCaseResponse> {
    const gymAlreadyExists = await this.gymRepository.findByTitle(title);

    if (gymAlreadyExists) {
      throw new GymAlreadyExistsError();
    }

    const gym = await this.gymRepository.create({
      title,
      description,
      phone,
      latitude,
      longitude,
    });

    return { gym };
  }
}
