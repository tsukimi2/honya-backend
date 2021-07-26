import UserFacingError from './UserFacingError.js'

export default class BadRequestError extends UserFacingError {
  constructor(message, options = {}) {
    super(message, options)

    if(options.err && Array.isArray(options.err)) {
      const arrErrmsg = options.err.map(elem => elem.msg)
      this.message = arrErrmsg.join(';')
    }
  }

  get name() {
    return 'BadRequestErr'
  }

  get statusCode() {
    return 400
  }
}
