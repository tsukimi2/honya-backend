import express from 'express'
import { body } from 'express-validator'
import validator from '../libs/validator.js'
import { validateJwt } from '../auth/jwt.js'
import { authController, userController } from '../di-container.js'

const router = express.Router()

router.get('/users/:uid', validateJwt, authController.isAuth, userController.getUserById)
router.patch('/users/:uid',
  validateJwt,
  authController.isAuth,
  body('password')
    .optional()
    .isLength({ min: 8, max: 20 }).withMessage('password must be between 8 and 20 characters'),
  validator,
  userController.updateUserById,
)
router.delete('/users/:uid', validateJwt, authController.isAuth, userController.deleteUserById)

router.param('uid', userController.attachUidParamToReq)

export default router
