import BaseError from './BaseError.js'

export default class DatabaseError extends BaseError {
  constructor(message='Data-related error', options={}) {
    super(message, options)
    this.name = 'DatabaseError'
    //this.message = 'Data-related error'
    this.statusCode = 500
    // this.err = null

    /*
    if(options) {
      for (const [key, value] of Object.entries(options)) {
        this[key] = value
      }
    }
    */

    if(this.err && this.err.name === 'MongoError') {
      if(this.err.message) {
        const mesageWords = this.err.message.split(' ')
        if(mesageWords[0] === 'E11000') {
          this.statusCode = 400
          this.message = 'Duplicate key error'
        }
      }
    }
  }
}