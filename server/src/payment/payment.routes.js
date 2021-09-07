import express from 'express'
import { validateJwt } from '../auth/jwt.js'
import { paymentController } from '../di-container.js'

const router = express.Router()

router.get('/payment/getToken', validateJwt, paymentController.generateToken)

export default router