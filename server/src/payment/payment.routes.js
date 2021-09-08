import express from 'express'
import { validateJwt } from '../auth/jwt.js'
import { paymentController } from '../di-container.js'

const router = express.Router()

router.get('/payment/braintree/getToken', validateJwt, paymentController.generateToken)
router.post('/payment/braintree', validateJwt, paymentController.processPayment)

export default router