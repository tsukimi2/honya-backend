import _ from 'lodash'
import BadRequestError from '../errors/BadRequestError.js'
import NotFoundError from '../errors/NotFoundError.js'
import UnprocessableEntityError from '../errors/UnprocessableEntityError.js'
import UserFacingError from '../errors/UserFacingError.js'

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
      if(err instanceof UserFacingError) {
        return next(err)
      }
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

  const addOrderToUserHistory = async (req, res, next) => {
    if(!(req.auth && req.auth._id)) {
      logger.warn('Failed to update user purchase history due to no user ID found when trying to push products into user purchas history')
      return next()
    }
    if(!(req.body && req.body.order && req.body.order.products && Array.isArray(req.body.order.products))) {
      logger.warn('Failed to update user purchase history due to no products found in order')
      return next()
    }
    if(!(req.body.order.transaction_id && req.body.order.amount)) {
      logger.warn('Failed to update user purchase history due to incomplete order info')
      return next()
    }

    const uid = req.auth._id
    try {
      await userService.addOrderToUserHistory(uid, req.body.order)
      return next()
    } catch(err) {
      return next(err)
    }
  }

  return {
    attachUidParamToReq,
    getUserById,
    updateUserById,
    deleteUserById,
    addOrderToUserHistory,
  }
}

export default userController