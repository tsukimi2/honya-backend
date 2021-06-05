import UserFacingError from '../errors/UserFacingError.js';
import DatabaseError from '../errors/DatabaseError.js';

const errHandler = (err, req, res, next) => {
  console.log(err)
  console.error(err.stack)
  console.log(err.name)
  console.log(err.message)
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
