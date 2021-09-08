import express from 'express'
import { validateJwt } from '../auth/jwt.js'
import { orderController } from '../di-container.js'

const router = express.Router()

router.post('/order', validateJwt, orderController.create)

export default router