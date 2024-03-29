import UserFacingError from './UserFacingError.js'

export default class ForbiddenError extends UserFacingError {
  constructor(message='ForbiddenError', options={}) {
    super(message, options)
  }

  get name() {
    return 'ForbiddenError'
  }

  get statusCode() {
    return 403
  }
}