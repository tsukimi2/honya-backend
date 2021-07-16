const userService = ({ userRepos }) => {
  const getUserById = async (id) => {
    return userRepos.getUserById(id, { lean: true })
  }

  const deleteUser = async (filterParams) => {
    return userRepos.deleteUser(filterParams)
  }

  const updateLoginHashAndRefreshToken = async (filterParams) => {
    await userRepos.updateLoginHashAndRefreshToken(filterParams)
  }

  return {
    getUserById,
    deleteUser,
    updateLoginHashAndRefreshToken
  }
}

export default userService