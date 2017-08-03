export default class HttpError extends Error {
  constructor(message, status = 400) {
    super(message);
    this.status = status;
  }

  getStatus() {
    return this.status;
  }
}