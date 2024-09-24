import { PrismaGymRepository } from "@/repositories/prisma/prisma-gym.repository";
import { FetchNearbyGymsUseCase } from "../fetch-nearby-gyms.usecase";

export function makeFetchNearbyGymsUseCase() {
  const gymsRepository = new PrismaGymRepository();
  const useCase = new FetchNearbyGymsUseCase(gymsRepository);

  return useCase;
}
