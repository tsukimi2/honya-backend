import UserFacingError from '../errors/UserFacingError.js';
import DatabaseError from '../errors/DatabaseError.js';
import logger from '../libs/logger/index.js'
import BaseError from '../errors/BaseError.js';

export const isOperationalError = (err) => (err instanceof BaseError) ? err.isOperational : false

const errHandler = (err, req, res, next) => {
  logger.error(err)
  logger.error(err.name)
  logger.error(err.message)
  logger.error(err.stack)
  if(err.err) {
    logger.log(err.err)
  }
  if(err instanceof UserFacingError) {
    return res.status(err.statusCode).json({
      err: err.name,
      errmsg: err.message
    })
  } else if(err instanceof DatabaseError) {
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

export default errHandler
