import express from 'express'
import passport from 'passport'
import { body } from 'express-validator'
import { register, login, logout } from './auth.controller.js'
import validator from '../libs/validator.js'
const router = express.Router()

router.get('/', (req, res, next) => {
  res.status(200).json({
    data: {
      message: 'Konnichiwa'
    }
  })    
})

router.post('/register',
  body('username')
    .isAlphanumeric()
    .withMessage('Username must contain only alphnumeric characters')
    .isLength({ min: 3, max: 20 })
    .withMessage('Username must have length between 3 and 20'),
  body('password')
    .isLength({ min: 8, max: 20 })
    .withMessage('Password must be between 8 and 20 characters'),
  body('email')
    .isEmail()
    .withMessage('Email must be of valid email format')
    .normalizeEmail(),
  validator,
  passport.authenticate('register', { session: false }),
  register
)

router.post('/login',
  passport.authenticate('login', { session: false }),
  login
)

router.post('/logout', logout)

export default router