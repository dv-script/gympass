import { PrismaUserRepository } from "@/repositories/prisma/prisma-user.repository";
import { AuthenticateUseCase } from "../authenticate.usecase";

export function makeAuthenticateUseCase() {
  return new AuthenticateUseCase(new PrismaUserRepository());
}
