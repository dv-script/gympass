import { PrismaCheckInRepository } from "@/repositories/prisma/prisma-check-in.repository";
import { GetUserMetricsUseCase } from "../get-user-metrics.usecase";

export function makeGetUserMetricsUseCase() {
  const checkInsRepository = new PrismaCheckInRepository();
  const useCase = new GetUserMetricsUseCase(checkInsRepository);
  
  return useCase;
}
