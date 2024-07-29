export class CheckInDistanceError extends Error {
  constructor() {
    super("You're trying to check-in more than 100 meters away from the gym .");
  }
}
