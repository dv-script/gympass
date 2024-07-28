export class InvalidCredentialsError extends Error {
  constructor() {
    super("Invalid credentials. Please, try again.");
  }
}
