import util from 'util'
import bcrypt from 'bcrypt'
import UnauthorizedError from '../errors/UnauthorizedError.js'
import { generateDatetime } from '../libs/datetime.js'
import { generateJwt } from '../auth/jwt.js'
import ForbiddenError from '../errors/ForbiddenError.js'

const authController = ({ config, logger, userService }) => {
  const register = (req, res) => {
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
      const { id: uid, username } = req.user
      const loginHash = await bcrypt.hash(username, config.get('security:password:saltrounds'))

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
      const refreshToken = await generateJwt({ uid }, config.get('security:jwt:refresh_token_expires_in'))
      // set refresh token cookie
      res.cookie('refreshToken', refreshToken, {
        // secure: true,
        httpOnly: true
      })

      // update user in db
      const updatedUser = await userService.updateLoginHashAndRefreshToken({ _id: uid }, {
        loginHash,
        lastLoginAt: new Date(),
        refreshToken,
        refreshTokenExpiresDt: generateDatetime(new Date(), config.get('security:jwt.refresh_token_expires_in_sec') * 1000)
      })

      res.status(200).json({
        message: 'Log in successful',
        access_token: accessToken,
        refresh_token: refreshToken,
        token_type: 'bearer',
        expires_in: parseInt(config.get('security:jwt.access_token_expires_in_sec')),
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
      throw new ForbiddenError('Access denied')
    }
  
    next()
  }

  return {
    register,
    login,
    logout,
    isAuth
  }
}

export default authController
