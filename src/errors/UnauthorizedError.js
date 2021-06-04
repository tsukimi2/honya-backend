import { UserFacingError } from "./UserFacingError.js";

export class UnauthorizedError extends UserFacingError {
  constructor(message='Unauthorized error', options={}) {
    super(message, options)
  }

  get name() {
    return 'AuthErr'
  }

  get statusCode() {
    return 401
  }
}