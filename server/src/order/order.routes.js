import express from 'express'
import { validateJwt } from '../auth/jwt.js'
import { orderController, userController, productController, authController } from '../di-container.js'

const router = express.Router()

router.get('/orders', validateJwt, authController.isAdmin, orderController.listOrders)
router.get('/orders/status-values', validateJwt, authController.isAdmin, orderController.getStatusValues)
router.get('/orders/user/:uid', validateJwt, authController.isAuth, orderController.getOrderHistory)
router.patch('/orders/:orderId/status', validateJwt, authController.isAdmin, orderController.updateOrderStatus)
router.post('/order',
  validateJwt,
  userController.addOrderToUserHistory,
  productController.decreaseQuantity,
  orderController.create
)

router.param('uid', userController.attachUidParamToReq)

export default router