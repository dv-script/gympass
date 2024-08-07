import { expect, describe, it, beforeEach } from "vitest";
import { InMemoryCheckInRepository } from "@/repositories/in-memory/in-memory-check-in.repository";
import { FetchUserCheckInsHistoryUseCase } from "./fetch-user-check-ins-history.usecase";

let checkInRepository: InMemoryCheckInRepository;
let sut: FetchUserCheckInsHistoryUseCase;

describe("Fetch User Check-In History Use Case", () => {
  beforeEach(() => {
    checkInRepository = new InMemoryCheckInRepository();
    sut = new FetchUserCheckInsHistoryUseCase(checkInRepository);
  });

  it("should be able to fetch user check ins", async () => {
    await checkInRepository.create({
      gym_id: "gym-01",
      user_id: "user-01",
    });

    await checkInRepository.create({
      gym_id: "gym-02",
      user_id: "user-01",
    });

    const { checkIns } = await sut.execute({
      userId: "user-01",
      page: 1,
    });

    expect(checkIns).toEqual([
      expect.objectContaining({ gym_id: "gym-01" }),
      expect.objectContaining({ gym_id: "gym-02" }),
    ]);
  });

  it("should be able to fetch paginated user check ins", async () => {
    for (let i = 1; i <= 22; i++) {
      await checkInRepository.create({
        gym_id: `gym-${i}`,
        user_id: "user-01",
      });
    }

    const { checkIns } = await sut.execute({
      userId: "user-01",
      page: 2,
    });

    expect(checkIns).toHaveLength(2);
    expect(checkIns).toEqual([
      expect.objectContaining({ gym_id: "gym-21" }),
      expect.objectContaining({ gym_id: "gym-22" }),
    ]);
  });
});
