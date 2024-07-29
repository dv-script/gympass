import { CheckIn } from "@prisma/client";
import { CheckInRepository } from "@/repositories/check-in.repository";
import { GymRepository } from "@/repositories/gym.repository";
import { ResourceNotFoundError } from "./errors/resource-not-found.error";
import { getDistanceInKilometersBetweenCoordinates } from "@/utils/get-distance-between-coordinates";
import { CheckInOnSameDayError } from "./errors/check-in-on-same-day.error";
import { CheckInDistanceError } from "./errors/check-in-distance.error";

interface CheckInUseCaseRequest {
  userId: string;
  gymId: string;
  userLatitude: number;
  userLongitude: number;
}

interface CheckInUseCaseResponse {
  checkIn: CheckIn;
}

export class CheckInUseCase {
  constructor(
    private checkInRepository: CheckInRepository,
    private gymRepository: GymRepository
  ) {}

  async execute({
    userId,
    gymId,
    userLatitude,
    userLongitude,
  }: CheckInUseCaseRequest): Promise<CheckInUseCaseResponse> {
    const gym = await this.gymRepository.findById(gymId);

    if (!gym) {
      throw new ResourceNotFoundError();
    }

    const distance = getDistanceInKilometersBetweenCoordinates({
      from: {
        latitude: Number(gym.latitude),
        longitude: Number(gym.longitude),
      },
      to: { latitude: userLatitude, longitude: userLongitude },
    });

    const MAX_DISTANCE_IN_KILOMETERS = 0.1;

    if (distance > MAX_DISTANCE_IN_KILOMETERS) {
      throw new CheckInDistanceError();
    }

    const checkInOnSameDay = await this.checkInRepository.findByUserIdOnDate({
      userId,
      date: new Date(),
    });

    if (checkInOnSameDay) {
      throw new CheckInOnSameDayError();
    }

    const checkIn = await this.checkInRepository.create({
      gym_id: gymId,
      user_id: userId,
    });

    return {
      checkIn,
    };
  }
}
