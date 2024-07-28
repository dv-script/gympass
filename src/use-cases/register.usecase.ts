import { UserRepository } from "@/repositories/user.repository";
import { hash } from "bcrypt";
import { UserAlreadyExists } from "./errors/user-already-exists.error";

interface RegisterUseCaseRequest {
  email: string;
  name: string;
  password: string;
}

export class RegisterUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute({ email, name, password }: RegisterUseCaseRequest) {
    const userWithSameEmail = await this.userRepository.findByEmail(email);

    if (userWithSameEmail) {
      throw new UserAlreadyExists();
    }

    const password_hash = await hash(password, 6);
    await this.userRepository.create({
      email,
      name,
      password_hash,
    });
  }
}
