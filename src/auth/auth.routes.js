import express from 'express'
import passport from 'passport'
import { register } from './auth.controller.js'
const router = express.Router()

router.get('/', (req, res, next) => {
  res.status(200).json({
    data: {
      message: 'Konnichiwa'
    }
  })    
})

router.post(
  '/register',
  passport.authenticate('register', { session: false }),
  register
)

router.post('/login', (req, res, next) => {

})

router.post('/logout', (req, res, next) => {

})

export default router