export default class CrosswordError extends Error {
  constructor(crosswordId, message) {
    super(message);
    this.crosswordId = crosswordId;
  }

  getCrosswordId() {
    return this.crosswordId;
  }
}