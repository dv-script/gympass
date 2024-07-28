import { UserRepository } from "@/repositories/user.repository";
import { InvalidCredentialsError } from "./errors/invalid-credentials.error";
import { compare } from "bcrypt";
import { User } from "@prisma/client";
import { ResourceNotFoundError } from "./errors/resource-not-found.error";

interface GetUserProfileUseCaseRequest {
  userId: string;
}

interface GetUserProfileUseCaseResponse {
  user: User;
}

export class GetUserProfileUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute({
    userId,
  }: GetUserProfileUseCaseRequest): Promise<GetUserProfileUseCaseResponse> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new ResourceNotFoundError();
    } 

    return { user };
  }
}
