import { PrismaCheckInRepository } from "@/repositories/prisma/prisma-check-in.repository";
import { ValidateCheckInUseCase } from "../validate-checkin.usecase";

export function makeValidateCheckInUseCase() {
  const checkInsRepository = new PrismaCheckInRepository();
  const useCase = new ValidateCheckInUseCase(checkInsRepository);

  return useCase;
}
