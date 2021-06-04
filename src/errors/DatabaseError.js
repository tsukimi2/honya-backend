export class DatabaseError extends Error {
  constructor(message, options={}) {
    super(message)
    this.name = 'DatabaseErr'
    this.message = 'Data-related error'
    this.statusCode = 500
    this.err = null

    if(options) {
      for (const [key, value] of Object.entries(options)) {
        this[key] = value
      }
    }

    if(err && err.name === 'MongoError') {
      if(err.message) {
        const mesageWords = err.message.split(' ')
        if(messageWords[0] === 'E11000') {
          this.message = 'Duplicate key error'
        }
      }
    }
  }
}