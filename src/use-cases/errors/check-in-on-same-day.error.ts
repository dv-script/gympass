export class CheckInOnSameDayError extends Error {
  constructor() {
    super("You have already checked in today. Please, try again tomorrow.");
  }
}
