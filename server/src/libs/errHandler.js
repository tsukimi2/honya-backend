import UserFacingError from '../errors/UserFacingError.js';
import DatabaseError from '../errors/DatabaseError.js';
import BaseError from '../errors/BaseError.js';

export const isOperationalError = (err) => (err instanceof BaseError) ? err.isOperational : false

const errHandler = ({ logger }) => {
  const recursiveFindInErr = (err) => {
    for (const [key, value] of Object.entries(err)) {
      if(key === 'name' && value === 'MongoError' && err.message) {
        const words = err.message.split(' ')
        if(words[0] === 'E11000') {
          return {
            statusCode: 400,
            err: 'DatabaseError',
            errmsg: 'duplicate key'
          }
        }
      } else if(key === 'err' && value !== null) {
        logger.error(err)
        logger.error(err.name)
        logger.error(err.message)
        logger.error(err.stack)
        return recursiveFindInErr(value)
      }
    }
  
    return null
  }

  const process = (err, req, res, next) => {   
    logger.error(err)
    logger.error(err.name)
    logger.error(err.message)
    logger.error(err.stack)

    if(err instanceof UserFacingError) {
      return res.status(err.statusCode).json({
        err: err.name,
        errmsg: err.message
      })
    }
    
    const result = recursiveFindInErr(err)
    if(result) {
      return res.status(result.statusCode).json({
        err: result.err,
        errmsg: result.errmsg,
      })
    }
    
    if(err instanceof DatabaseError) {
      return res.status(err.statusCode).json({
        err: err.name,
        errmsg: err.message
      })
    }
  
    return res.status(500).json({
      err: 'InternalServerErr',
      errmsg: 'Internal server error'
    })
  }

  return {
    process
  }
}

export default errHandler
