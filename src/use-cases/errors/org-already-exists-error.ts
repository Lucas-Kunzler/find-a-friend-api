export class OrgAlreadyExistsError extends Error {
  constructor() {
    super("email already in use.");
  }
}
