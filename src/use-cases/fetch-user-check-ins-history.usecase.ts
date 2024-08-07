import { CheckIn } from "@prisma/client";
import { CheckInRepository } from "@/repositories/check-in.repository";

interface FetchUserCheckInsUseCaseRequest {
  userId: string;
  page: number;
}

interface FetchUserCheckInsUseCaseResponse {
  checkIns: CheckIn[];
}

export class FetchUserCheckInsHistoryUseCase {
  constructor(private checkInRepository: CheckInRepository) {}

  async execute({
    userId,
    page,
  }: FetchUserCheckInsUseCaseRequest): Promise<FetchUserCheckInsUseCaseResponse> {
    const checkIns = await this.checkInRepository.findManyByUserId({
      userId,
      page,
    });

    return { checkIns };
  }
}
