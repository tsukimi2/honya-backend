import BaseError from './BaseError.js'

export default class UserFacingError extends BaseError {
  constructor(message, options={}) {
    super(message, options)
    
    /*
    if(options) {
      for (const [key, value] of Object.entries(options)) {
        this[key] = value
      }
    }
    */
  }
}