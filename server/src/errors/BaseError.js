export default class BaseError extends Error {
  constructor(message, options={}) {
    super(message)

    if(options) {
      for (const [key, value] of Object.entries(options)) {
        this[key] = value
      }

      if(options.isOperational === undefined) {
        this['isOperational'] = true
      }
    }

    Error.captureStackTrace(this)
  }    
}