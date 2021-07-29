import User from '../../src/user/user.model.js'
import { ROLE } from '../../src/user/user.constants.js'

export const generateUserParams = ({ userProfile, hasHashedPassword=false, optParams={}}) => {
  let username = 'user'
  let initUserParams = {}
  const password = 'testing1'

  if(userProfile === 'validUser1' || userProfile === 'validAdmin1') {
    if(userProfile === 'validAdmin1') {
      username = `${ROLE.ADMIN}1`
      initUserParams['role'] = ROLE.ADMIN
    }

    initUserParams['username'] = username
    initUserParams['email'] = `${username}@gmail.com`

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
