export class UserAlreadyExistsError extends Error {
  constructor() {
    super("This email is already in use");
  }
}
