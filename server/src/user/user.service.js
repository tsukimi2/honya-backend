const userService = ({ userRepos }) => {
  const getUserById = async (id) => {
    return userRepos.getUserById(id, { lean: true })
  }

  const deleteUser = async (filterParams) => {
    return userRepos.deleteUser(filterParams)
  }

  const updateLoginHashAndRefreshToken = async (filterParams, updateParams={}) => {
    await userRepos.updateLoginHashAndRefreshToken(filterParams, updateParams)
  }

  return {
    getUserById,
    deleteUser,
    updateLoginHashAndRefreshToken
  }
}

export default userService