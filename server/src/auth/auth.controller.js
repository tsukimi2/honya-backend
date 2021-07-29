import util from 'util'
import bcrypt from 'bcrypt'
import UnauthorizedError from '../errors/UnauthorizedError.js'
import { generateDatetime } from '../libs/datetime.js'
import { generateJwt } from '../auth/jwt.js'
import ForbiddenError from '../errors/ForbiddenError.js'
import { generateTokenCookieOptions } from '../libs/cookies.js'

const authController = ({ config, logger, userService }) => {
  const register = (req, res) => {
    if(!req || (req && !req.user)) {
      logger.warn('Missing user profile in request')
      throw new UnauthorizedError('User registration failed')
    }
  
    const { username, email, role } = req.user
  
    res.status(201).json({
      data: {
        user: {
          username,
          email,
          role
        }
      }
    })
  }

  const login = async (req, res, next) => {
    const bcryptHash = util.promisify(bcrypt.hash)
    const ACCESS_TOKEN_EXPIRES_IN = config.get('security:jwt:access_token_expires_in')

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
      const { id: uid, username, role } = req.user
      const loginHash = await bcryptHash(username, config.get('security:password:saltrounds'))

      // set user hash cookie
      let loginHashCookieOptions = generateTokenCookieOptions(config.get('app:node_env'))
      res.cookie('loginHash', loginHash, loginHashCookieOptions)

      // generate new access token
      const accessTokencookieOptions = generateTokenCookieOptions(config.get('app:node_env'), {
        maxAge: config.get('security:jwt:access_token_expires_in_sec') * 1000
      })
      const accessToken = await generateJwt({ uid, role }, ACCESS_TOKEN_EXPIRES_IN)
      // set access token cookie
      res.cookie('accessToken', accessToken, accessTokencookieOptions)

      // generate new refresh token
      const refreshTokencookieOptions = generateTokenCookieOptions(config.get('app:node_env'), {
        maxAge: config.get('security:jwt:refresh_token_expires_in_sec') * 1000
      })
      const refreshToken = await generateJwt({ uid, role }, config.get('security:jwt:refresh_token_expires_in'))
      // set refresh token cookie
      res.cookie('refreshToken', refreshToken, refreshTokencookieOptions)

      // update user in db
      const updatedUser = await userService.updateLoginHashAndRefreshToken({ _id: uid }, {
        loginHash,
        lastLoginAt: new Date(),
        refreshToken,
        refreshTokenExpiresDt: generateDatetime(new Date(), config.get('security:jwt:refresh_token_expires_in_sec') * 1000)
      })

      res.status(200).json({
        message: 'Log in successful',
        access_token: accessToken,
        refresh_token: refreshToken,
        token_type: 'bearer',
        expires_in: config.get('security:jwt:access_token_expires_in_sec'),
      })
    } catch(err) {
      logger.warn(err)      
      next(new UnauthorizedError('User log in failed', {
        err
      }))
    }
  }

  const googleAuth = async (req, res, next) => {
    const bcryptHash = util.promisify(bcrypt.hash)
    const ACCESS_TOKEN_EXPIRES_IN = config.get('security:jwt:access_token_expires_in')

    if(!req || (req && !req.user)) {
      logger.warn('Missing user profile in request')
      next(new UnauthorizedError('User log in failed'))
      return
    }

    if(!req.user.googleAccountId) {
      logger.warn('Missing google account ID in request')
      next(new UnauthorizedError('User log in failed'))
      return
    }

    try {
      // generate login hash from username
      const { _id: uid, googleAccountEmail } = req.user
      const loginHash = await bcryptHash(googleAccountEmail, config.get('security:password:saltrounds'))
      // set user hash cookie
      let loginHashCookieOptions = generateTokenCookieOptions(config.get('app:node_env'))
      res.cookie('loginHash', loginHash, loginHashCookieOptions)

      // generate new access token
      const accessTokencookieOptions = generateTokenCookieOptions(config.get('app:node_env'), {
        maxAge: config.get('security:jwt:access_token_expires_in_sec') * 1000
      })
      const accessToken = await generateJwt({ uid, role }, ACCESS_TOKEN_EXPIRES_IN)
      // set access token cookie
      res.cookie('accessToken', accessToken, accessTokencookieOptions)

      // generate new refresh token
      const refreshTokencookieOptions = generateTokenCookieOptions(config.get('app:node_env'), {
        maxAge: config.get('security:jwt:refresh_token_expires_in_sec') * 1000
      })
      const refreshToken = await generateJwt({ uid, role }, config.get('security:jwt:refresh_token_expires_in'))
      // set refresh token cookie
      res.cookie('refreshToken', refreshToken, refreshTokencookieOptions)

      // update user in db
      const updatedUser = await userService.updateLoginHashAndRefreshToken({ _id: uid }, {
        loginHash,
        lastLoginAt: new Date(),
        refreshToken,
        refreshTokenExpiresDt: generateDatetime(new Date(), config.get('security:jwt:refresh_token_expires_in_sec') * 1000)
      })

      res.status(200).json({
        message: 'Log in successful',
        access_token: accessToken,
        refresh_token: refreshToken,
        token_type: 'bearer',
        expires_in: config.get('security:jwt:access_token_expires_in_sec'),
      })
    } catch(err) {
      logger.warn(err)      
      next(new UnauthorizedError('User log in failed', {
        err
      }))
    }
  }

  const logout = (req, res) => {
    // delete user refresh token from db  
    if(req && req.cookies && req.cookies.loginHash) {
      const loginHash = req.cookies.loginHash
      try {
        userService.updateLoginHashAndRefreshToken({ loginHash })
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

  const isAuth = (req, res, next) => {
    const isAuthFlag = req.auth && req.user && req.auth._id === req.user._id
    if(!isAuthFlag) {
      logger.error('req auth')
      logger.error(req.auth)
      logger.error('req user')
      logger.error(req.user)
      throw new ForbiddenError('Access denied')
    }
  
    next()
  }

  const isAdmin = async (req, res, next) => {
    if(!req.auth || (req.auth && req.auth.role !== 'admin')) {
      return next(new ForbiddenError('User is not admin'))
    }

    next()
  }

  return {
    register,
    login,
    googleAuth,
    logout,
    isAuth,
    isAdmin
  }
}

export default authController
