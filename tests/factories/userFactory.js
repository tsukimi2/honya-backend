// import mongoose from 'mongoose'
import User from '../../src/user/user.model.js'


export const generateUserParams = ({ userProfile }) => {
  if(userProfile === 'validUser1') {
    const username = 'user'

    return {
      username,
      password: 'testing1',
      email: `${username}@gmail.com`
    }
  }

  return {}
}

export const generateUser = async ({ userProfile }) => {
  // const User = mongoose.model('User')
  const userParams = generateUserParams({ userProfile })
  return new User(userParams).save()
}
