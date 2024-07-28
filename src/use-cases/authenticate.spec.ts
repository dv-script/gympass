import { beforeEach, describe, expect, it } from "vitest";
import { AuthenticateUseCase } from "./authenticate.usecase";
import { UserInMemoryRepository } from "@/repositories/in-memory/in-memory-user.repository";
import { hash } from "bcrypt";
import { InvalidCredentialsError } from "./errors/invalid-credentials.error";

let userInMemoryRepository: UserInMemoryRepository;
let sut: AuthenticateUseCase;

describe("Authenticate Use Case", () => {
  beforeEach(() => {
    userInMemoryRepository = new UserInMemoryRepository();
    sut = new AuthenticateUseCase(userInMemoryRepository);
  });

  it("should be able to authenticate", async () => {
    await userInMemoryRepository.create({
      name: "John Doe",
      email: "jdoe@example.com",
      password_hash: await hash("Password@123", 6),
    });

    const { user } = await sut.execute({
      email: "jdoe@example.com",
      password: "Password@123",
    });

    expect(user.id).toEqual(expect.any(String));
  });

  it("should not be able to authenticate with wrong e-mail", async () => {
    expect(async () => {
      await sut.execute({
        email: "jdoe@example.com",
        password: "Password@123",
      });
    }).rejects.toBeInstanceOf(InvalidCredentialsError);
  });
});
