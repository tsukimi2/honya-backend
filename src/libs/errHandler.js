import UserFacingError from '../errors/UserFacingError.js';
import DatabaseError from '../errors/DatabaseError.js';

const errHandler = (err, req, res, next) => {
  console.error(err)
  console.error(err.name)
  console.error(err.message)
  console.error(err.stack)
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
