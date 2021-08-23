import bcrypt from 'bcrypt'
import User from '../../src/user/user.model.js'
import { ROLE } from '../../src/user/user.constants.js'
import config from '../../src/libs/config/index.js'

export const generateUserParams = async ({ userProfile='validUser1', hasHashedPassword=false, optParams={}}) => {
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
      initUserParams['hashedPassword'] = await bcrypt.hash(password, config.get('security:password:saltrounds'))
    } else {      
      // initUserParams['password'] = password
    }
    initUserParams['password'] = password
  }

  if(optParams && optParams.username) {
    optParams['email'] = `${optParams.username}@gmail.com`
  }

  return Object.assign({}, initUserParams, optParams)
}

export const generateUser = async ({ userProfile, optParams={}, providedUserParams=null}) => {
  const userParams = providedUserParams ? providedUserParams : await generateUserParams({ userProfile, optParams })
  return new User(userParams).save()
}
