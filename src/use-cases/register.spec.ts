import { describe, expect, it } from "vitest";
import { RegisterUseCase } from "./register.usecase";
import { compare } from "bcrypt";
import { UserInMemoryRepository } from "@/repositories/in-memory/in-memory-user.repository";
import { UserAlreadyExistsError } from "./errors/user-already-exists.error";

describe("Register Use Case", () => {
  it("should hash user password upon registration", async () => {
    const userInMemoryRepository = new UserInMemoryRepository();
    const registerUseCase = new RegisterUseCase(userInMemoryRepository);

    const { user } = await registerUseCase.execute({
      name: "John Doe",
      email: "jdoe@example.com",
      password: "Password@123",
    });

    const isPasswordCorrectlyHashed = await compare(
      "Password@123",
      user.password_hash
    );

    expect(isPasswordCorrectlyHashed).toBe(true);
  });

  it("should not be able to register with same e-mail twice", async () => {
    const userInMemoryRepository = new UserInMemoryRepository();
    const registerUseCase = new RegisterUseCase(userInMemoryRepository);

    const email = "jdoe@example.com";

    await registerUseCase.execute({
      name: "John Doe",
      email,
      password: "Password@123",
    });

    expect(async () => {
      await registerUseCase.execute({
        name: "John Doe",
        email,
        password: "Password@123",
      });
    }).rejects.toBeInstanceOf(UserAlreadyExistsError);
  });

  it("should be able to register", async () => {
    const userInMemoryRepository = new UserInMemoryRepository();
    const registerUseCase = new RegisterUseCase(userInMemoryRepository);

    const { user } = await registerUseCase.execute({
      name: "John Doe",
      email: "jdoe@example.com",
      password: "Password@123",
    });

    expect(user.id).toEqual(expect.any(String));
  });
});
