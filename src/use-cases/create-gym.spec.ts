import { beforeEach, describe, expect, it } from "vitest";
import { InMemoryGymRepository } from "@/repositories/in-memory/in-memory-gym.repository";
import { CreateGymUseCase } from "./create-gym.usecase";
import { GymAlreadyExistsError } from "./errors/gym-already-exists.error";

let inMemoryGymRepository: InMemoryGymRepository;
let sut: CreateGymUseCase;

describe("Create Gym Use Case", () => {
  beforeEach(() => {
    inMemoryGymRepository = new InMemoryGymRepository();
    sut = new CreateGymUseCase(inMemoryGymRepository);
  });

  it("should be able to create a gym", async () => {
    const { gym } = await sut.execute({
      title: "Gym",
      description: "Description",
      phone: "123456",
      latitude: -22.9480332,
      longitude: -43.1884821,
    });

    expect(gym.id).toEqual(expect.any(String));
  });

  it("should not be able to create a gym with the same title", async () => {
    await inMemoryGymRepository.create({
      title: "Gym",
      description: "Description",
      phone: "123456",
      latitude: -22.9480332,
      longitude: -43.1884821,
    });

    expect(async () => {
      await sut.execute({
        title: "Gym",
        description: "Description",
        phone: "123456",
        latitude: -22.9480332,
        longitude: -43.1884821,
      });
    }).rejects.toBeInstanceOf(GymAlreadyExistsError);
  });
});
