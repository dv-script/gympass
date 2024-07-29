import { expect, describe, it, beforeEach, vi, afterEach } from "vitest";
import { InMemoryCheckInRepository } from "@/repositories/in-memory/in-memory-check-in.repository";
import { CheckInUseCase } from "./check-in.usecase";
import { InMemoryGymRepository } from "@/repositories/in-memory/in-memory-gym.repository";
import { Decimal } from "@prisma/client/runtime/library";
import { CheckInDistanceError } from "./errors/check-in-distance.error";
import { CheckInOnSameDayError } from "./errors/check-in-on-same-day.error";

let checkInRepository: InMemoryCheckInRepository;
let gymRepository: InMemoryGymRepository;
let sut: CheckInUseCase;

describe("Check In Use Case", () => {
  beforeEach(() => {
    checkInRepository = new InMemoryCheckInRepository();
    gymRepository = new InMemoryGymRepository();
    sut = new CheckInUseCase(checkInRepository, gymRepository);
    vi.useFakeTimers();

    gymRepository.create({
      id: "gym-id",
      title: "Gym",
      latitude: new Decimal(-22.9480332),
      longitude: new Decimal(-43.1884821),
      phone: "",
      description: "",
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should be able to check in", async () => {
    const { checkIn } = await sut.execute({
      userId: "user-id",
      gymId: "gym-id",
      userLatitude: -22.9480332,
      userLongitude: -43.1884821,
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  it("should not be able to check in twice in the same day", async () => {
    vi.setSystemTime(new Date(2024, 1, 1, 10, 0, 0));

    await sut.execute({
      userId: "user-id",
      gymId: "gym-id",
      userLatitude: -22.9480332,
      userLongitude: -43.1884821,
    });

    expect(async () => {
      await sut.execute({
        userId: "user-id",
        gymId: "gym-id",
        userLatitude: -22.9480332,
        userLongitude: -43.1884821,
      });
    }).rejects.toBeInstanceOf(CheckInOnSameDayError);
  });

  it("should not be able to check in differents days", async () => {
    vi.setSystemTime(new Date(2024, 1, 1, 10, 0, 0));

    await sut.execute({
      userId: "user-id",
      gymId: "gym-id",
      userLatitude: -22.9480332,
      userLongitude: -43.1884821,
    });

    vi.setSystemTime(new Date(2024, 1, 2, 10, 0, 0));

    const { checkIn } = await sut.execute({
      userId: "user-id",
      gymId: "gym-id",
      userLatitude: -22.9480332,
      userLongitude: -43.1884821,
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  it("should not be able to check in on distant gym", () => {
    gymRepository.gyms.push({
      id: "gym-02",
      title: "New Gym",
      latitude: new Decimal(-22.9480332),
      longitude: new Decimal(-43.1884821),
      phone: "",
      description: "",
    });

    expect(async () => {
      await sut.execute({
        userId: "user-id",
        gymId: "gym-02",
        userLatitude: -23.011052,
        userLongitude: -43.4246719,
      });
    }).rejects.toBeInstanceOf(CheckInDistanceError);
  });
});
