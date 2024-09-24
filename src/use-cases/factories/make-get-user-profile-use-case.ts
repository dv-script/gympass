import { PrismaUserRepository} from '@/repositories/prisma/prisma-user.repository'
import { GetUserProfileUseCase } from '../get-user-profile.usecase'

export function makeGetUserProfileUseCase() {
  const usersRepository = new PrismaUserRepository()
  const useCase = new GetUserProfileUseCase(usersRepository)

  return useCase
}