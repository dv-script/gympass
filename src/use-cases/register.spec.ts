import { beforeEach, describe, expect, it } from "vitest";
import { RegisterUseCase } from "./register.usecase";
import { compare } from "bcrypt";
import { UserInMemoryRepository } from "@/repositories/in-memory/in-memory-user.repository";
import { UserAlreadyExistsError } from "./errors/user-already-exists.error";

let userInMemoryRepository: UserInMemoryRepository;
let sut: RegisterUseCase;

describe("Register Use Case", () => {
  beforeEach(() => {
    userInMemoryRepository = new UserInMemoryRepository();
    sut = new RegisterUseCase(userInMemoryRepository);
  });

  it("should hash user password upon registration", async () => {
    const { user } = await sut.execute({
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
    const email = "jdoe@example.com";

    await sut.execute({
      name: "John Doe",
      email,
      password: "Password@123",
    });

    expect(async () => {
      await sut.execute({
        name: "John Doe",
        email,
        password: "Password@123",
      });
    }).rejects.toBeInstanceOf(UserAlreadyExistsError);
  });

  it("should be able to register", async () => {
    const { user } = await sut.execute({
      name: "John Doe",
      email: "jdoe@example.com",
      password: "Password@123",
    });

    expect(user.id).toEqual(expect.any(String));
  });
});
