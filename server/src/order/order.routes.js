import express from 'express'
import { validateJwt } from '../auth/jwt.js'
import { orderController, userController } from '../di-container.js'

const router = express.Router()

router.post('/order', validateJwt, userController.addOrderToUserHistory, orderController.create)

export default router