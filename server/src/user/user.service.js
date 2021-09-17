import bcrypt from 'bcrypt'
import ApplicationError from "../errors/ApplicationError.js"
import BadRequestError from "../errors/BadRequestError.js"

const userService = ({ userRepos, config }) => {
  const getUserById = async (id, opts={}) => {
    return userRepos.getById(id, opts)
  }

  const getUser = async (filterParams, opts={}) => {
    return userRepos.getOne(filterParams, opts)
  }

  const createUser = async (params) => {
    return userRepos.create(params)
  }

  const updateUserById = async (_id, updateParams) => {
    // if one of the params to update is user, check to ensure that it is different
    // from the existing password
    if(updateParams.password) {
      const user = await userRepos.getById(_id, {
        selectParams: '-_id hashedPassword',
        lean: true
      })

      if(!user) {
        throw new BadRequestError('user to be updated not found')
      }

      //const newHashedPassword = await bcrypt.hash(updateParams.password, config.get('security:password:saltrounds'))
      //if(newHashedPassword === user.hashedPassword) {
      const isSamePassword = await bcrypt.compare(updateParams.password, user.hashedPassword)
      if(isSamePassword) {
        throw new BadRequestError('password to update is the same as the existing password')
      }
    }

    return userRepos.updateOne({ _id }, updateParams)
  }

  const deleteUser = async (filterParams) => {
    return userRepos.deleteOne(filterParams)
  }

  const getOneOrCreateByGoogleDetails = async (googleAccountId, googleAccountEmail) => {
    if(!googleAccountId || !googleAccountEmail) {
      throw new ApplicationError('Missing googleAccountId or googleAccountEmail')
    }

    const targetUser = await userRepos.getOne({ googleAccountId }, { lean: true })
    if(!targetUser || (Array.isArray(targetUser) && targetUser.length === 0)) {
      return createUser({
        googleAccountId,
        googleAccountEmail
      })
    }

    return targetUser
  }

  const updateLoginHashAndRefreshToken = async (filterParams, updateParams={}) => {
    await userRepos.updateLoginHashAndRefreshToken(filterParams, updateParams)
  }

  const addOrderToUserHistory = async (uid, order) => {
    let history = []

    order.products.forEach(item => {
      history.push({
        _id: item._id,
        name: item.name,
        description: item.description,
        category: item.category,
        price: item.price,
        quantity: item.count,
        transaction_id: order.transaction_id,
        amount: order.amount,
      })
    })    

    const filterParams = { _id: uid }
    const updateParams = { $push: { history: order }}
    const opts = { new: true }
    await userRepos.findOneAndUpdate(filterParams, updateParams, opts)
  }

  return {
    getUserById,
    getUser,
    createUser,
    updateUserById,
    deleteUser,
    getOneOrCreateByGoogleDetails,
    updateLoginHashAndRefreshToken,
    addOrderToUserHistory,
  }
}

export default userService