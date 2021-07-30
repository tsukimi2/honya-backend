import UserFacingError from './UserFacingError.js'

export default class NotFoundError extends UserFacingError {
  constructor(message='NotFoundError', options={}) {
    super(message, options)
  }

  get name() {
    return 'NotFoundError'
  }

  get statusCode() {
    return 404
  }
}
