import bcrypt from 'bcrypt'
import UnauthorizedError from '../errors/UnauthorizedError.js'
import User from '../user/user.model.js'
import { generateDatetime } from '../libs/datetime.js'
import { generateJwt } from '../auth/jwt.js'
import ForbiddenError from '../errors/ForbiddenError.js'
import config from '../libs/config/index.js'
import logger from '../libs/logger/index.js'

const SALTROUNDS = config.get('security:password:saltrounds')
// const JWT_SECRET = config.get('security:jwt:secret')
const ACCESS_TOKEN_EXPIRES_IN = config.get('security:jwt:access_token_expires_in')
const ACCESS_TOKEN_EXPIRES_IN_SEC = config.get('security:jwt.access_token_expires_in_sec')
const REFRESH_TOKEN_EXPIRES_IN = config.get('security:jwt:refresh_token_expires_in')
const REFRESH_TOKEN_EXPIRES_IN_SEC = config.get('security:jwt.refresh_token_expires_in_sec')

export const register = (req, res) => {
  if(!req || (req && !req.user)) {
    logger.warn('Missing user profile in request')
    throw new UnauthorizedError('User registration failed')
  }

  const { username, email } = req.user

  res.status(201).json({
    data: {
      user: {
        username,
        email
      }
    }
  })
}

export const login = async (req, res, next) => {
  if(!req || (req && !req.user)) {
    logger.warn('Missing user profile in request')
    next(new UnauthorizedError('User log in failed'))
    return
  }

  if(!req.user.username) {
    logger.warn('Missing username in request')
    next(new UnauthorizedError('User log in failed'))
    return
  }

  try {
    // generate login hash from username
    const { id: uid, username } = req.user
    const loginHash = bcrypt.hashSync(username, SALTROUNDS)
    // set user hash cookie
    res.cookie('loginHash', loginHash, {
      // scure: true,
      httpOnly: true
    })

    // generate new access token
    const accessToken = await generateJwt({ uid }, ACCESS_TOKEN_EXPIRES_IN)
    // set access token cookie
    res.cookie('accessToken', accessToken, {
      // secure: true,
      httpOnly: true
    })

    // generate new refresh token
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
    logger.warn(err)
    next(new UnauthorizedError('User log in failed', {
      err
    }))
  }
}

export const logout = (req, res) => {
  // delete user refresh token from db
  if(req && req.cookies && req.cookies.loginHash) {
    const loginHash = req.cookies.loginHash
    try {
      User.updateLoginHashAndRefreshToken({ loginHash }, { 
        loginHash: null,
        refreshToken: null,
        refreshTokenExpiresDt: null,
      })
    } catch(err) {
      logger.warn('Update loginhash and refresh token failed during logout')
      logger.warn(err)
    }
  }

  req.logout()

  // remove cookies from browser
  res.clearCookie('loginHash')
  res.clearCookie('accessToken')
  res.clearCookie('refreshToken')

  res.status(204).end()
}

export const isAuth = (req, res, next) => {
  const isAuthFlag = req.auth && req.user && req.auth._id === req.user._id
  if(!isAuthFlag) {
    throw new ForbiddenError('Access denied')
  }

  next()
}
