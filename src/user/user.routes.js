import express from 'express'
import { validateJwt } from '../auth/jwt.js'
import { isAuth } from '../auth/auth.controller.js'
import { attachUidParamToReq, getUserById, deleteUserById } from './user.controller.js'

const router = express.Router()

/* GET users listing. */
router.get('/users/:uid', validateJwt, isAuth, getUserById);
router.delete('/users/:uid', validateJwt, isAuth, deleteUserById)

router.param('uid', attachUidParamToReq)

export default router
