import express from 'express'
import { validateJwt } from '../auth/jwt.js'
import { authController, userController } from '../di-container.js'

const router = express.Router()

/* GET users listing. */
router.get('/users/:uid', validateJwt, authController.isAuth, userController.getUserById);
router.delete('/users/:uid', validateJwt, authController.isAuth, userController.deleteUserById)

router.param('uid', userController.attachUidParamToReq)

export default router
