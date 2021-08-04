import { validationResult } from 'express-validator'
import BadRequestError from '../errors/BadRequestError.js'

const validator = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {  
    return next(new BadRequestError('Bad request error', {
      err: errors.array()
    }))
  }

  next()
}

export const isInEnum = (searchStr, arrEnum) => {
  let arrSearchStr = []

  if(searchStr && searchStr.indexOf(',') !== -1) {
    if(searchStr.indexOf(',') === -1) {
      arrSearchStr.push(searchStr)
    } else {
      arrSearchStr = searchStr.split(',')
    }

    for(let i = 0; i < arrSearchStr.length; i++) {
      if(!arrEnum.includes(arrSearchStr[i].trim())) {
        return false
      }
    }
  }

  return true
}

export default validator