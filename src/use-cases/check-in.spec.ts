import { expect, describe, it, beforeEach } from "vitest";
import { InMemoryCheckInRepository } from "@/repositories/in-memory/in-memory-check-in.repository";
import { CheckInUseCase } from "./check-in.usecase";

let checkInRepository: InMemoryCheckInRepository;
let sut: CheckInUseCase;

describe("Get User Profile Use Case", () => {
  beforeEach(() => {
    checkInRepository = new InMemoryCheckInRepository();
    sut = new CheckInUseCase(checkInRepository);
  });

  it("should be able to check in", async () => {
    const { checkIn } = await sut.execute({
      userId: "user-id",
      gymId: "gym-id",
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });
});
