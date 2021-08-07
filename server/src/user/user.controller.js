import _ from 'lodash'
import BadRequestError from '../errors/BadRequestError.js'
import NotFoundError from '../errors/NotFoundError.js'
import UnprocessableEntityError from '../errors/UnprocessableEntityError.js'

const userController = ({ logger, userService }) => {
  const getUserById = async (req, res, next) => {
    const { _id } = req.user
    let user = null
  
    try {
      user = await userService.getUserById(_id)
    } catch(err) {
      logger.warn(err)
      return next(new NotFoundError('User not found', {
        err
      }))
    }
  
    if(!user) {
      return next(new NotFoundError('User not found'))
    }

    return res.status(200).json({
      data: {
        user: {
          _id: user._id.toString(),
          username: user.username,
          email: user.email
        }
      }
    })
  }

  const updateUserById = async (req, res, next) => {
    const { _id } = req.user
    let user = null
    let updateParams = {}
    const { password } = req.body

    if(password) {
      updateParams['password'] = password
    }
    if(_.isEmpty(updateParams)) {
      return next(new BadRequestError('no param to update'))
    }

    try {
      user = await userService.updateUserById(_id, updateParams)
    } catch(err) {    
      return next(new UnprocessableEntityError('failed to update user', { err }))
    }
    if(!user) {
      return next(new UnprocessableEntityError('failed to update user'))
    }

    return res.status(200).json({
      data: {
        user: {
          _id: user._id.toString(),
          username: user.username,
          email: user.email,
        }
      }
    })
  }

  const deleteUserById = async (req, res, next) => {
    const { _id } = req.user
  
    try {
      await userService.deleteUser({ _id })
    } catch(err) {
      next(new NotFoundError('User delete unsuccessful'), { err })
      return
    }
  
    return res.status(204).end()
  }

  const attachUidParamToReq = (req, res, next, uid) => {
    if(uid) {
      req.user = {
        _id: uid
      }
    }
  
    next()
  }

  return {
    attachUidParamToReq,
    getUserById,
    updateUserById,
    deleteUserById
  }
}

export default userController