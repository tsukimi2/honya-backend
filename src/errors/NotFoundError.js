import UserFacingError from './UserFacingError.js'

export default class NotFoundError extends UserFacingError {
  constructor(message, options={}) {
    super(message, options)
  }

  get name() {
    return 'NotFoundErr'
  }

  get statusCode() {
    return 404
  }
}
