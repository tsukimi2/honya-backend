const userRepos = ({ User }) => {
  const getUserById = async (id) => {
    return User.findById(id).exec()
  }

  const deleteUser = async (filterParams) => {
    await User.deleteOne(filterParams)
  }

  const updateLoginHashAndRefreshToken = async (filterParams) => {
    await User.updateLoginHashAndRefreshToken(filterParams, {
      loginHash: null,
      refreshToken: null,
      refreshTokenExpiresDt: null,
    })
  }

  return {
    getUserById,
    deleteUser,
    updateLoginHashAndRefreshToken
  }
}

export default userRepos