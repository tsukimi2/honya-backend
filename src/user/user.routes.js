import express from 'express'
import { validateJwt } from '../auth/jwt.js'
const router = express.Router()

/* GET users listing. */
// isAuth
router.get('/users/:userId', validateJwt, function(req, res, next) {
  const user = req.user

  res.status(200).json({
    message: 'Konnichiwa',
  })
});

export default router
