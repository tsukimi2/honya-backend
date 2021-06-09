import express from 'express'
import { validateJwt } from '../auth/jwt.js'
import { isAuth } from '../auth/auth.controller.js'
import { attachUidParamToReq, getUserById } from './user.controller.js'

const router = express.Router()

/* GET users listing. */
router.get('/users/:uid', validateJwt, isAuth, getUserById);

router.param('uid', attachUidParamToReq)

export default router
