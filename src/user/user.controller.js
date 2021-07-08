import DatabaseError from '../errors/DatabaseError.js'
import NotFoundError from '../errors/NotFoundError.js'

const userController = ({ logger, userService }) => {
  const getUserById = async (req, res, next) => {
    const { _id } = req.user
    let user = null
  
    try {
      // user = await User.findById(_id).exec()
      user = await userService.getUserById(_id)
    } catch(err) {
      logger.warn(err)
      next(new DatabaseError('DatabaseErr', {
        err
      }))
      return
    }
  
    if(!user) {
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

  const deleteUserById = async (req, res, next) => {
    const { _id } = req.user
  
    try {
      await userService.deleteUser({ _id })
    } catch(err) {
      console.log('err')
      console.log(err)
      next(new NotFoundError('User delete unsuccessful'), { err })
      return
    }
  
    return res.status(204).end()
  }

  const attachUidParamToReq = (req, res, next, uid) => {
    req.user = {
      _id: uid
    }
  
    next()
  }

  return {
    attachUidParamToReq,
    getUserById,
    deleteUserById
  }
}

export default userController