import { UserRepository } from "@/repositories/user.repository";
import { hash } from "bcrypt";
import { UserAlreadyExistsError } from "./errors/user-already-exists.error";
import { User } from "@prisma/client";

interface RegisterUseCaseRequest {
  email: string;
  name: string;
  password: string;
}

interface RegisterUseCaseResponse {
  user: User;
}

export class RegisterUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute({
    email,
    name,
    password,
  }: RegisterUseCaseRequest): Promise<RegisterUseCaseResponse> {
    const userWithSameEmail = await this.userRepository.findByEmail(email);

    if (userWithSameEmail) {
      throw new UserAlreadyExistsError();
    }

    const password_hash = await hash(password, 6);
    const user = await this.userRepository.create({
      email,
      name,
      password_hash,
    });

    return { user };
  }
}
