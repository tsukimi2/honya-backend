import UserFacingError from './UserFacingError.js'

export default class UnprocessableEntityError extends UserFacingError {
  constructor(message='Unauthorized error', options={}) {
    super(message, options)
  }

  get name() {
    return 'UnprocessableEntityError'
  }

  get statusCode() {
    return 422
  }
}