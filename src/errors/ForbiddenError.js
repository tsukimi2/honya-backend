import UserFacingError from './UserFacingError.js'

export default class ForbiddenError extends UserFacingError {
  constructor(message, options={}) {
    super(message, options)
  }

  get name() {
    return 'ForbiddenErr'
  }

  get statusCode() {
    return 403
  }
}