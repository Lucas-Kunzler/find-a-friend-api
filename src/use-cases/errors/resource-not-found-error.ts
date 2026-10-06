export class ResourceNotFoundError extends Error {
  constructor() {
    super("resource not found.");
  }
}
