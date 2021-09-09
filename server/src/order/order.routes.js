import express from 'express'
import { validateJwt } from '../auth/jwt.js'
import { orderController, userController, productController, authController } from '../di-container.js'

const router = express.Router()

router.get('/orders', validateJwt, authController.isAdmin, orderController.listOrders)

router.post('/order',
  validateJwt,
  userController.addOrderToUserHistory,
  productController.decreaseQuantity,
  orderController.create
)

export default router