import { PrismaGymRepository } from "@/repositories/prisma/prisma-gym.repository";
import { CreateGymUseCase } from "../create-gym.usecase";

export function makeCreateGymUseCase() {
  const gymsRepository = new PrismaGymRepository();
  const useCase = new CreateGymUseCase(gymsRepository);
  
  return useCase;
}
