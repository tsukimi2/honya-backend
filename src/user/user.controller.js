import User from './user.model.js'
import DatabaseError from '../errors/DatabaseError.js'
import NotFoundError from '../errors/NotFoundError.js'

export const attachUidParamToReq = (req, res, next, uid) => {
  req.user = {
    _id: uid
  }

  next()
}

export const getUserById = async (req, res) => {
  const { _id } = req.user
  let user = null

  try {
    user = await User.findById(_id).exec()
  } catch(err) {
    console.log('Error in user.controller.js getUserById')
    console.log(err)
    throw new DatabaseError('DatabaseErr', {
      err
    })
  }

  if(!user) {
    const currDatetime = new Date().toString()
    console.log(`${__filename}: ${currDatetime}: User not found`)
    throw new NotFoundError('User not found')
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