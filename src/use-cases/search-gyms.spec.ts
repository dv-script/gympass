import { expect, describe, it, beforeEach } from "vitest";
import { InMemoryGymRepository } from "@/repositories/in-memory/in-memory-gym.repository";
import { SearchGymsUseCase } from "./search-gyms.usecase";
import { ResourceNotFoundError } from "./errors/resource-not-found.error";

let gymsRepository: InMemoryGymRepository;
let sut: SearchGymsUseCase;

describe("Search Gyms Use Case", () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymRepository();
    sut = new SearchGymsUseCase(gymsRepository);
  });

  it("should be able to search gyms", async () => {
    await gymsRepository.create({
      title: "Javascript Gym",
      description: null,
      phone: null,
      longitude: 0,
      latitude: 0,
    });

    await gymsRepository.create({
      title: "Typescript Gym",
      description: null,
      phone: null,
      longitude: 0,
      latitude: 0,
    });

    const { gyms } = await sut.execute({ query: "Javascript Gym", page: 1 });

    expect(gyms).toHaveLength(1);
    expect(gyms).toEqual([
      expect.objectContaining({ title: "Javascript Gym" }),
    ]);
  });

  it("shouldn't be able to search gyms with wrong query", () => {
    expect(() =>
      sut.execute({ query: "Non-existing Gym", page: 1 })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it("should be able to search gyms with pagination", async () => {
    for (let i = 1; i <= 22; i++) {
      await gymsRepository.create({
        title: `Gym ${i}`,
        description: null,
        phone: null,
        longitude: 0,
        latitude: 0,
      });
    }

    const { gyms } = await sut.execute({ query: "Gym", page: 2 });
    expect(gyms).toHaveLength(2);
  });
});
