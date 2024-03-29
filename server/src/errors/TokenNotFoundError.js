import UnauthorizedError from './UnauthorizedError.js'

export default class TokenNotFoundError extends UnauthorizedError {
  constructor(message='TokenNotFoundError', options={}) {
    super(message, options)
  }

  get name() {
    return 'TokenNotFoundError'
  }
}