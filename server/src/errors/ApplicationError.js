export default class ApplicationError extends Error {
  constructor(message, options={}) {
    super(message)
    
    if(options) {
      for (const [key, value] of Object.entries(options)) {
        this[key] = value
      }
    }
  }
}