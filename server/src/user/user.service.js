import ApplicationError from "../errors/ApplicationError.js"

const userService = ({ userRepos }) => {
  const getUserById = async (id) => {
    return userRepos.getUserById(id, { lean: true })
  }

  const createUser = async (params) => {
    return userRepos.createUser(params)
  }

  const deleteUser = async (filterParams) => {
    return userRepos.deleteUser(filterParams)
  }

  const getOneOrCreateByGoogleDetails = async (googleAccountId, googleAccountEmail) => {
    if(!googleAccountId || !googleAccountEmail) {
      throw new ApplicationError('Missing googleAccountId or googleAccountEmail')
    }

    const targetUser = await userRepos.getUser({ googleAccountId }, { lean: true })
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
    createUser,
    deleteUser,
    getOneOrCreateByGoogleDetails,
    updateLoginHashAndRefreshToken
  }
}

export default userService