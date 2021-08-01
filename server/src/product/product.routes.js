import express from 'express'
import { body } from 'express-validator'
import validator from '../libs/validator.js'
import { validateJwt } from '../auth/jwt.js'
import { authController, productController } from '../di-container.js'
import { MAX_ITEMS_PER_PRODUCT_PER_TRANSACTION } from './product.constants.js'

const router = express.Router()

router.post('/product',
  validateJwt,
  authController.isAdmin,
  /*
  body('name')
    .isAlphanumeric('en-US', { ignore: /-_() / }).withMessage('product name must consist of alphanumeric characters only')
    .notEmpty().withMessage('product name is required')
    .isLength({ max: 32 }).withMessage('product name must have length not greater than 33 characters'),
  body('description')
    .isAlphanumeric('en-US', { ignore: /-_() / }).withMessage('product name must consist of alphanumeric characters only')
    .notEmpty().withMessage('product description is required')
    .isLength({ max: 32 }).withMessage('product description must have length not greater than 2000 characters'),
  body('price')
    .isCurrency({
      allow_negatives: false }).withMessage('price must be in currency format')
    .notEmpty().withMessage('price is required'),
  body('category')
    .isAlphanumeric('en-US', { ignore: /-_() / }).withMessage('catgeory name must consist of alphanumeric characters only')
    .notEmpty().withMessage('catgeory name is required'),
  body('quantity')
    .isInt({ min: 0, max: MAX_ITEMS_PER_PRODUCT_PER_TRANSACTION }),
  body('sold')
    .isInt({ min: 0, max: MAX_ITEMS_PER_PRODUCT_PER_TRANSACTION }),
  body('shipping')
    .isBoolean({ loose: false }),
  validator,
  */
  productController.createProduct
)

export default router
