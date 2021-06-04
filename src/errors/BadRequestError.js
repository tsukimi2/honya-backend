import UserFacingError from './UserFacingError.js'

export class BadRequestError extends UserFacingError {
  constructor(message, options = {}) {
    super(message, options)
  }

  get statusCode() {
    return 400
  }
}