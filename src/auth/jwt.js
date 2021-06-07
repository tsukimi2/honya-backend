import jwt from 'jsonwebtoken'
import ForbiddenError from '../errors/ForbiddenError.js'
import User from '../user/user.model.js'
import { generateDatetime } from '../libs/datetime.js'

const JWT_SECRET = 'myjwtsecret'
const ACCESS_TOKEN_EXPIRES_IN='10s'
const ACCESS_TOKEN_EXPIRES_IN_SEC = 86400
const REFRESH_TOKEN_EXPIRES_IN='60d'
const REFRESH_TOKEN_EXPIRES_IN_SEC = 5184000

export const generateJwt = async (payload, expiresIn = ACCESS_TOKEN_EXPIRES_IN) => jwt.sign(payload, JWT_SECRET, {
  expiresIn
})

export const validateJwt = async (req, res, next) => {
  if(!req || (req && !req.cookies)) {
    console.log('Error in jwt.js validateJwt')
    console.log('Missing cookies')
    throw new ForbiddenError('Forbidden access')
  }

  if(!req.cookies.accessToken || !req.cookies.refreshToken) {
    console.log('Error in jwt.js validateJwt')
    console.log('Missing access or refresh token')
    throw new ForbiddenError('Forbidden access')
  }
  const accessToken = req.cookies.accessToken
  const refreshToken = req.cookies.refreshToken

  if(!req.cookies.loginHash) {
    console.log('Error in jwt.js validateJwt')
    console.log('Missing loginHash')
    throw new ForbiddenError('Forbidden access')
  }
  const loginHash = req.cookies.loginHash

  try {
    console.log('success')
    const { uid } = jwt.verify(accessToken, JWT_SECRET)
    return next(null, { uid })
  } catch(err) {
    // access token expired; issue new access token using refresh token
    if(err.name === 'TokenExpiredError') {
      console.log('TokenExpiredError')
      let user = null

      try {
        user = await User.findOne({ loginHash })
        if(!user) {
          console.log('Error in jwt.js validateJwt')
          console.log('User not found in db')
          throw new ForbiddenError('Forbidden access')
        }
  
        const { _id: uid, refreshToken: storedRefreshToken, refreshTokenExpiryDt } = user
        if(!refreshTokenExpiryDt || storedRefreshToken !== refreshToken) {
          console.log('Error in jwt.js validateJwt')
          console.log('Stored refresh token different from cookie refresh token')
          throw new ForbiddenError('Forbidden access')
        }
  
        // if refresh token expired already, issue both access and refresh tokens
        if(refreshTokenExpiryDt > new Date()) {
          // generate new refresh token
          const newRefreshToken = generateJWT({ uid }, REFRESH_TOKEN_EXPIRES_IN)
          // set new refresh token in cookie
          res.cookie('refreshToken', newRefreshToken, {
            // secure: true,
            httpOnly: true
          })
          // save new refresh token in storage
          const newRefreshTokenExpiryDt = generateDatetime(new Date(), REFRESH_TOKEN_EXPIRES_IN_SEC * 1000)
          const updateUser = User.findOneAndUpdate({ _id: uid }, { refreshToken: newRefreshToken, refreshTokenExpirtyDt: newRefreshTokenExpiryDt }, { new: true })
        }
      } catch(err) {
        console.log('Error in jwt.js validateJwt')
        console.log(err)
        throw new ForbiddenError('Forbidden access')
      }

      // issue access token
      const newAccessToken = generateJWT(user, ACCESS_TOKEN_EXPIRES_IN_SEC)
      // set access token in cookie
      res.cookie('accessToken', newAccessToken, {
        // secure: true,
        httpOnly: true,
      })

      next(null, { uid: _id })
    } else {
      // Errors other than TokenExpiredError are rejected
      console.log('Error in validateJwt')
      console.log('Token error other than TokenExpiredError')
      console.log(err)
      throw new ForbiddenError('Forbidden access')
    }
  }
}