export class UserAlreadyExists extends Error {
  constructor() {
    super("This email is already in use");
  }
}
