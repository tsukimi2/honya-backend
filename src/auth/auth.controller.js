import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import UnauthorizedError from '../errors/UnauthorizedError.js'
import User from '../user/user.model.js'
import { generateDatetime } from '../libs/datetime.js'
import { generateJwt } from '../auth/jwt.js'

const DEFAULT_SALTROUNDS = 10
const JWT_SECRET = 'myjwtsecret'
const ACCESS_TOKEN_EXPIRES_IN='10s'
const ACCESS_TOKEN_EXPIRES_IN_SEC = 86400
const REFRESH_TOKEN_EXPIRES_IN='60d'
const REFRESH_TOKEN_EXPIRES_IN_SEC = 5184000

export const register = (req, res) => {
  if(!req || (req && !req.user)) {
    console.log('Error in auth.controller.js register')
    console.log('Missing user profile in request')
    throw new UnauthorizedError('User registration failed')
  }

  const { username, email } = req.user

  res.status(200).json({
    message: 'Register successful',
    data: {
      user: {
        username,
        email
      }
    }
  })
}

export const login = async (req, res) => {
  if(!req || (req && !req.user)) {
    console.log('Error in auth.controller.js login')
    console.log('Missing user profile in request')
    throw new UnauthorizedError('User log in failed')
  }

  if(!req.user.username) {
    console.log('Error in auth.controller.js login')
    console.log('Missing username in request')
    throw new UnauthorizedError('User log in failed')    
  }

  try {
    // generate login hash from username
    const { id: uid, username } = req.user
    const loginHash = bcrypt.hashSync(username, DEFAULT_SALTROUNDS)
    // set user hash cookie
    res.cookie('loginHash', loginHash, {
      // scure: true,
      httpOnly: true
    })

    // generate new access token
    /*
    const accessToken = await jwt.sign({ uid }, JWT_SECRET, {
      expiresIn: ACCESS_TOKEN_EXPIRES_IN
    })
    */
    const accessToken = await generateJwt({ uid }, ACCESS_TOKEN_EXPIRES_IN)
    // set access token cookie
    res.cookie('accessToken', accessToken, {
      // secure: true,
      httpOnly: true
    })

    // generate new refresh token
    /*
    const refreshToken = await jwt.sign({ uid }, JWT_SECRET, {
      expiresIn: REFRESH_TOKEN_EXPIRES_IN
    })
    */
    const refreshToken = await generateJwt({ uid }, REFRESH_TOKEN_EXPIRES_IN)
    // set refresh token cookie
    res.cookie('refreshToken', refreshToken, {
      // secure: true,
      httpOnly: true
    })

    // update user in db
    const updatedUser = await User.updateLoginHashAndRefreshToken({ _id: uid }, {
      loginHash,
      lastLoginAt: new Date(),
      refreshToken,
      refreshTokenExpiresDt: generateDatetime(new Date(), REFRESH_TOKEN_EXPIRES_IN_SEC * 1000)
    })
    res.status(200).json({
      message: 'Log in successful',
      access_token: accessToken,
      refresh_token: refreshToken,
      token_type: 'bearer',
      expires_in: ACCESS_TOKEN_EXPIRES_IN_SEC,
    })
  } catch(err) {
    console.log('Error in auth.controller.js login')
    console.log(err)
    throw new UnauthorizedError('User log in failed', {
      err
    })
  }
}

export const logout = (req, res) => {
  // delete user refresh token from db
  if(req && req.cookies && req.cookies.loginHash) {
    const loginHash = req.cookies.loginHash
    User.updateLoginHashAndRefreshToken({ loginHash }, { 
      loginHash: null,
      refreshToken: null,
      refreshTokenExpiresDt: null,
    })
  }

  req.logout()

  // remove cookies from browser
  res.clearCookie('loginHash')
  res.clearCookie('accessToken')
  res.clearCookie('refreshToken')

  res.status(200).json({
    message: 'Log out successful'
  })

}