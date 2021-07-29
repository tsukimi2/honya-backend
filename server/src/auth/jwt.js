import jwt from 'jsonwebtoken'
import ForbiddenError from '../errors/ForbiddenError.js'
import TokenNotFoundError from '../errors/TokenNotFoundError.js'
import User from '../user/user.model.js'
import { generateDatetime } from '../libs/datetime.js'
import config from '../libs/config/index.js'
import logger from '../libs/logger/index.js'
import { generateTokenCookieOptions } from '../libs/cookies.js'

const JWT_SECRET = config.get('security:jwt:secret')
const ACCESS_TOKEN_EXPIRES_IN = config.get('security:jwt:access_token_expires_in')
const ACCESS_TOKEN_EXPIRES_IN_SEC = config.get('security:jwt:access_token_expires_in_sec')
const REFRESH_TOKEN_EXPIRES_IN = config.get('security:jwt:refresh_token_expires_in')
const REFRESH_TOKEN_EXPIRES_IN_SEC = config.get('security:jwt:refresh_token_expires_in_sec')

const attachJwtPayloadToRequest = (req, { requestProperty='auth', payload, fieldsToInclude=[] }) => {
  req[requestProperty] = {}
  fieldsToInclude.forEach(fieldname => {
    if(fieldname === 'uid') {
      return req[requestProperty]['_id'] = payload[fieldname]
    }
    return req[requestProperty][fieldname] = payload[fieldname]
  })
}

export const generateJwt = async (payload, expiresIn = ACCESS_TOKEN_EXPIRES_IN) => jwt.sign(payload, JWT_SECRET, {
  expiresIn
})

export const validateJwt = async (req, res, next) => {
  if(!req || (req && !req.cookies)) {
    logger.warn('Missing cookies')
    return next(new ForbiddenError('Forbidden access; Missing cookies'))
  }

  if(!req.cookies.loginHash) {
    logger.warn('Missing loginHash')
    return next(new ForbiddenError('Forbidden access'))
  }
  const loginHash = req.cookies.loginHash

  try {
    if(!req.cookies.accessToken) {
      logger.warn('Missing access token')
      // next(new ForbiddenError('Forbidden access'))
      // return
      throw new TokenNotFoundError('access token cookie not found')
    }
    const accessToken = req.cookies.accessToken
    // const refreshToken = req.cookies.refreshToken

    const payload = jwt.verify(accessToken, JWT_SECRET)
    attachJwtPayloadToRequest(req, {
      payload,
      fieldsToInclude: [ 'uid', 'role' ]
    })
    return next()
  } catch(err) {
    // access token expired; issue new access token using refresh token
    if(err.name === 'TokenExpiredError' || err.name === 'TokenNotFoundError') {
      logger.info('Access token missing or expired')
      let user = null

      if(!req.cookies.refreshToken) {
        logger.error('Missing refresh token')
        next(new ForbiddenError('Missing refresh token'))
        return
      }
      const refreshToken = req.cookies.refreshToken

      try {
        user = await User.findOne({ loginHash })
      } catch(err) {
        logger.warn(err)
        return next(new ForbiddenError('Forbidden access'))
      }

      if(!user) {
        logger.warn('User not found in db')
        return next(new ForbiddenError('Forbidden access'))
      }

      // const { _id: uid, refreshToken: storedRefreshToken, refreshTokenExpiresDt } = user
      let { _id: uid, refreshToken: storedRefreshToken, refreshTokenExpiresDt } = user
      if(!refreshTokenExpiresDt || storedRefreshToken !== refreshToken) {
        logger.warn('Stored refresh token different from cookie refresh token')
        return next(new ForbiddenError('Forbidden access'))
      }

      try {
        // if refresh token expired already, issue both access and refresh tokens
        if(refreshTokenExpiresDt > new Date()) {
          logger.info('refresh token expired')

          // generate new refresh token
          const refreshTokencookieOptions = generateTokenCookieOptions(config.get('app:node_env'), {
            maxAge: REFRESH_TOKEN_EXPIRES_IN_SEC * 1000
          })
          const newRefreshToken = await generateJwt({ uid }, REFRESH_TOKEN_EXPIRES_IN)
          // set new refresh token in cookie
          res.cookie('refreshToken', newRefreshToken, refreshTokencookieOptions)
          // save new refresh token in storage
          const newRefreshTokenExpiresDt = generateDatetime(new Date(), REFRESH_TOKEN_EXPIRES_IN_SEC * 1000)
          User.findOneAndUpdate({ _id: uid }, { refreshToken: newRefreshToken, refreshTokenExpiresDt: newRefreshTokenExpiresDt }, { new: true })
        }

        // issue access token
        const newAccessToken = await generateJwt({ uid }, ACCESS_TOKEN_EXPIRES_IN_SEC)
        // set access token in cookie
        const accessTokencookieOptions = generateTokenCookieOptions(config.get('app:node_env'), {
          maxAge: ACCESS_TOKEN_EXPIRES_IN_SEC * 1000
        })
        res.cookie('accessToken', newAccessToken, accessTokencookieOptions)

        attachJwtPayloadToRequest(req, {
          payload: {
            _id: user._id.toString()
          },
          fieldsToInclude: [ '_id', 'role' ]
        })
      } catch(err) {
        logger.warn(err)
        return next(new ForbiddenError('Forbidden access'))
      }
      return next()
    } else {
      // Errors other than TokenExpiredError are rejected
      logger.error('Token error other than TokenExpiredError')
      logger.error(err)
      return(new ForbiddenError('Forbidden access'))
    }
  }
}