import User from './user.model.js'
import DatabaseError from '../errors/DatabaseError.js'
import NotFoundError from '../errors/NotFoundError.js'
import logger from '../libs/logger/index.js'

export const attachUidParamToReq = (req, res, next, uid) => {
  req.user = {
    _id: uid
  }

  next()
}

export const getUserById = async (req, res, next) => {
  const { _id } = req.user
  let user = null

  try {
    user = await User.findById(_id).exec()
  } catch(err) {
    logger.warn(err)
    next(new DatabaseError('DatabaseErr', {
      err
    }))
    return
  }

  if(!user) {
    const currDatetime = new Date().toString()
    next(new NotFoundError('User not found'))
    return
  }
  
  res.status(200).json({
    data: {
      user: {
        _id: user._id.toString(),
        username: user.username,
        email: user.email
      }
    }
  })
}

export const deleteUserById = async (req, res, next) => {
  const { _id } = req.user

  try {
    await User.deleteOne({ _id })
  } catch(err) {
    next(new NotFoundError('User delete unsuccessful'), { err })
    return
  }

  return res.status(204).end()
}