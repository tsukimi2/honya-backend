import { validationResult } from 'express-validator'
import BadRequestError from '../errors/BadRequestError.js'

const validator = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    next(new BadRequestError('Bad request error', {
      err: errors.array()
    }))
  }

  next()
}

export default validator