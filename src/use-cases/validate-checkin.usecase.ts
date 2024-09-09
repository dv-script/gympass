import { CheckIn } from "@prisma/client";
import { CheckInRepository } from "@/repositories/check-in.repository";
import { ResourceNotFoundError } from "./errors/resource-not-found.error";
import dayjs from "dayjs";
import { LateCheckInValidationError } from "./errors/late-check-in-validation.error";
import { CheckInAlreadyValidatedError } from "./errors/check-in-already-validated.error";

interface ValidateCheckInUseCaseRequest {
  checkInId: string;
}

interface ValidateCheckInUseCaseResponse {
  checkIn: CheckIn;
}

export class ValidateCheckInUseCase {
  constructor(private checkInRepository: CheckInRepository) {}

  async execute({
    checkInId,
  }: ValidateCheckInUseCaseRequest): Promise<ValidateCheckInUseCaseResponse> {
    const checkIn = await this.checkInRepository.findById(checkInId);

    if (!checkIn) {
      throw new ResourceNotFoundError();
    }

    if (checkIn.validated_at) {
      throw new CheckInAlreadyValidatedError();
    }

    const distanceInMinutesFromCheckInCreation = dayjs(new Date()).diff(
      checkIn.created_at,
      "minute",
    );

    if (distanceInMinutesFromCheckInCreation > 20) {
      throw new LateCheckInValidationError();
    }

    checkIn.validated_at = new Date();

    await this.checkInRepository.update(checkIn);

    return { checkIn };
  }
}
