import { expect, describe, it, beforeEach, vi } from "vitest";
import { InMemoryCheckInRepository } from "@/repositories/in-memory/in-memory-check-in.repository";
import { ValidateCheckInUseCase } from "./validate-checkin.usecase";
import { ResourceNotFoundError } from "./errors/resource-not-found.error";
import { afterEach } from "node:test";
import { LateCheckInValidationError } from "./errors/late-check-in-validation.error";
import { CheckInAlreadyValidatedError } from "./errors/check-in-already-validated.error";

let checkInRepository: InMemoryCheckInRepository;
let sut: ValidateCheckInUseCase;

describe("Validate Check In Use Case", () => {
  beforeEach(() => {
    checkInRepository = new InMemoryCheckInRepository();
    sut = new ValidateCheckInUseCase(checkInRepository);
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should be able to validate the check-in", async () => {
    const checkIn = await checkInRepository.create({
      gym_id: "gym_id",
      user_id: "user_id",
    });

    await sut.execute({ checkInId: checkIn.id });

    expect(checkIn.validated_at).toEqual(expect.any(Date));
    expect(checkInRepository.checkIns[0].validated_at).toEqual(
      expect.any(Date)
    );
  });

  it("should not be able to validate an inexistent check-in", async () => {
    expect(async () => {
      await sut.execute({ checkInId: "inexistent_id" });
    }).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it("should not be able to validate the check-in after 20 minutes of its creation", async () => {
    vi.setSystemTime(new Date(2024, 1, 1, 12, 0, 0));

    const checkIn = await checkInRepository.create({
      gym_id: "gym_id",
      user_id: "user_id",
    });

    const twentyMinutesLater = 1000 * 60 * 21;
    vi.advanceTimersByTime(twentyMinutesLater);

    expect(async () => {
      await sut.execute({ checkInId: checkIn.id });
    }).rejects.toBeInstanceOf(LateCheckInValidationError);
  });

  it("should not be able to validate the check-in twice", async () => {
    const checkIn = await checkInRepository.create({
      gym_id: "gym_id",
      user_id: "user_id",
    });

    await sut.execute({ checkInId: checkIn.id });

    expect(async () => {
      await sut.execute({ checkInId: checkIn.id });
    }).rejects.toBeInstanceOf(CheckInAlreadyValidatedError);
  });
});
