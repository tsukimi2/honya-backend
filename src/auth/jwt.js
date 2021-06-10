import jwt from 'jsonwebtoken'
import ForbiddenError from '../errors/ForbiddenError.js'
import User from '../user/user.model.js'
import { generateDatetime } from '../libs/datetime.js'
import config from '../libs/config/index.js'

const JWT_SECRET = config.get('security:jwt:secret')
const ACCESS_TOKEN_EXPIRES_IN = config.get('security:jwt:access_token_expires_in')
const ACCESS_TOKEN_EXPIRES_IN_SEC = config.get('security:jwt.access_token_expires_in_sec')
const REFRESH_TOKEN_EXPIRES_IN = config.get('security:jwt:refresh_token_expires_in')
const REFRESH_TOKEN_EXPIRES_IN_SEC = config.get('security:jwt.refresh_token_expires_in_sec')

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
    console.error('Error in jwt.js validateJwt')
    console.error('Missing cookies')
    return next(new ForbiddenError('Forbidden access; Missing cookies'))
  }

  if(!req.cookies.accessToken || !req.cookies.refreshToken) {
    console.error('Error in jwt.js validateJwt')
    console.error('Missing access or refresh token')
    return next(new ForbiddenError('Forbidden access'))
  }
  const accessToken = req.cookies.accessToken
  const refreshToken = req.cookies.refreshToken

  if(!req.cookies.loginHash) {
    console.error('Error in jwt.js validateJwt')
    console.error('Missing loginHash')
    return next(new ForbiddenError('Forbidden access'))
  }
  const loginHash = req.cookies.loginHash

  try {
    const payload = jwt.verify(accessToken, JWT_SECRET)
    attachJwtPayloadToRequest(req, {
      payload,
      fieldsToInclude: [ 'uid' ]
    })
    return next()
  } catch(err) {
    // access token expired; issue new access token using refresh token
    if(err.name === 'TokenExpiredError') {
      console.error('TokenExpiredError')
      let user = null

      try {
        user = await User.findOne({ loginHash })
      } catch(err) {
        console.error('Error in jwt.js validateJwt')
        console.error(err)
        return next(new ForbiddenError('Forbidden access'))
      }

      if(!user) {
        console.error('Error in jwt.js validateJwt')
        console.error('User not found in db')
        return next(new ForbiddenError('Forbidden access'))
      }

      // const { _id: uid, refreshToken: storedRefreshToken, refreshTokenExpiresDt } = user
      let { _id: uid, refreshToken: storedRefreshToken, refreshTokenExpiresDt } = user
      if(!refreshTokenExpiresDt || storedRefreshToken !== refreshToken) {
        console.error('Error in jwt.js validateJwt')
        console.error('Stored refresh token different from cookie refresh token')
        return next(new ForbiddenError('Forbidden access'))
      }

      try {
        // if refresh token expired already, issue both access and refresh tokens
        if(refreshTokenExpiresDt > new Date()) {
          // generate new refresh token
          const newRefreshToken = await generateJwt({ uid }, REFRESH_TOKEN_EXPIRES_IN)
          // set new refresh token in cookie
          res.cookie('refreshToken', newRefreshToken, {
            // secure: true,
            httpOnly: true
          })
          // save new refresh token in storage
          const newRefreshTokenExpiresDt = generateDatetime(new Date(), REFRESH_TOKEN_EXPIRES_IN_SEC * 1000)
          const updateUser = User.findOneAndUpdate({ _id: uid }, { refreshToken: newRefreshToken, refreshTokenExpiresDt: newRefreshTokenExpiresDt }, { new: true })
        }

        // issue access token
        const newAccessToken = await generateJwt({ uid }, ACCESS_TOKEN_EXPIRES_IN_SEC)
        // set access token in cookie
        res.cookie('accessToken', newAccessToken, {
          // secure: true,
          httpOnly: true,
        })

        attachJwtPayloadToRequest(req, {
          payload: {
            _id: user._id.toString()
          },
          fieldsToInclude: [ '_id' ]
        })
      } catch(err) {
        console.error('Error in jwt.js validateJwt')
        console.error(err)
        return next(new ForbiddenError('Forbidden access'))
      }
      return next()
    } else {
      // Errors other than TokenExpiredError are rejected
      console.error('Error in validateJwt')
      console.error('Token error other than TokenExpiredError')
      console.error(err)
      return(new ForbiddenError('Forbidden access'))
    }
  }
}