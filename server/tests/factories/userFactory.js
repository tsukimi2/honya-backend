import User from '../../src/user/user.model.js'

export const generateUserParams = ({ userProfile, hasHashedPassword=false, optParams={}}) => {
  const username = 'user'
  let initUserParams = {}
  const password = 'testing1'

  if(userProfile === 'validUser1') {
    initUserParams = {
      username,
      email: `${username}@gmail.com`
    }

    if(hasHashedPassword) {
      initUserParams['hashedPassword'] = password
    } else {
      initUserParams['password'] = password
    }
  }

  return Object.assign({}, initUserParams, optParams)
}

export const generateUser = async ({ userProfile }) => {
  const userParams = generateUserParams({ userProfile })
  return new User(userParams).save()
}
