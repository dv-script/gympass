export class CheckInAlreadyValidatedError extends Error {
  constructor() {
    super("Check-in already validated");
  }
}