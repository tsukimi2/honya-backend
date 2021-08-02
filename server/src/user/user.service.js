import ApplicationError from "../errors/ApplicationError.js"

const userService = ({ userRepos }) => {
  const getUserById = async (id, opts={}) => {
    return userRepos.getById(id, opts)
  }

  const getUser = async (filterParams, opts={}) => {
    return userRepos.getOne(filterParams, opts)
  }

  const createUser = async (params) => {
    return userRepos.create(params)
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

  return {
    getUserById,
    getUser,
    createUser,
    deleteUser,
    getOneOrCreateByGoogleDetails,
    updateLoginHashAndRefreshToken
  }
}

export default userService