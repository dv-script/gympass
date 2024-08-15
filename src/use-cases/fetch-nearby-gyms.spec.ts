import { expect, describe, it, beforeEach } from "vitest";
import { InMemoryGymRepository } from "@/repositories/in-memory/in-memory-gym.repository";
import { ResourceNotFoundError } from "./errors/resource-not-found.error";
import { FetchNearbyGymsUseCase } from "./fetch-nearby-gyms.usecase";

let gymsRepository: InMemoryGymRepository;
let sut: FetchNearbyGymsUseCase;

describe("Fetch Nearby Gyms Use Case", () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymRepository();
    sut = new FetchNearbyGymsUseCase(gymsRepository);

    await gymsRepository.create({
      id: "gym-id",
      title: "Gym",
      latitude: -22.9480332,
      longitude: -43.1884821,
    });

    await gymsRepository.create({
      id: "gym-id-2",
      title: "Gym 2",
      latitude: -23.9480332,
      longitude: -41.1884821,
    });
  });

  it("should be able to find gyms 10 kilometers nearby", async () => {
    const { gyms } = await sut.execute({
      userLatitude: -22.9480332,
      userLongitude: -43.1884821,
    });

    expect(gyms).toHaveLength(1);
    expect(gyms).toEqual([expect.objectContaining({ id: "gym-id" })]);
  });

  it("should not be able to find gyms more than 10 kilometers nearby", () => {
    expect(async () =>
      sut.execute({
        userLatitude: -42.9480332,
        userLongitude: -21.1884821,
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
