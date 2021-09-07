import express from 'express'
import { body, query } from 'express-validator'
import validator from '../libs/validator.js'
import { isInEnum } from '../libs/validator.js'
import { validateJwt } from '../auth/jwt.js'
import { authController, productController } from '../di-container.js'
import { DISPLAY } from '../libs/constants.js'

const router = express.Router()


router.get('/products/categories', productController.listCategories)
router.get('/products/:id', productController.getProductById)

router.get('/products',
  query('sortBy')
    .optional()
    .custom((value) => isInEnum(value, [ '_id', 'name', 'price', 'sold', 'createdAt' ]))
    .withMessage('only fields sold and createdAt is allowed to sortby'),
  query('order')
    .optional()
    .custom((value) => isInEnum(value, [ DISPLAY.ORDER.ASC.toString(), DISPLAY.ORDER.DESC.toString() ]))
    .withMessage(`incorrecct orderby value`),
  query('limit')
    .optional()
    .isInt({ min: 1, max: DISPLAY.LIMIT.MAX }),
  validator,
  productController.getProducts
)

router.get('/products/:productId/related',
  query('limit')
    .optional()
    .isInt({ min: 1, max: DISPLAY.LIMIT.MAX }),
  validator,
  productController.getRelatedProducts
)

router.get('/products/:productId/photo', productController.getPhoto)
//router.get('/products/:productId/photo', productController.photo)

router.post('/products/search',
/*
  body('filters')
    .isObject().withMessage('missing search filters'),
  body('sortBy')
  .optional(),
  body('order')
  .optional(),
  body('limit')
  .optional(),
  body('skip')
  .optional()
  .isInt(),
  */
/*
  body('name')
    .optional()
    .isAlphanumeric('en-US', { ignore: /-_() / }).withMessage('product name must consist of alphanumeric characters only')
    .isLength({ max: 32 }).withMessage('product name must have length not greater than 33 characters'),
  body('description')
    .isAlphanumeric('en-US', { ignore: /-_() / }).withMessage('product name must consist of alphanumeric characters only')
    .isLength({ max: 32 }).withMessage('product description must have length not greater than 2000 characters'),
  body('price')
    .optional()
    .isCurrency({ allow_negatives: false }).withMessage('price must be in currency format'),
  body('category')
    .optional()
    .isString().withMessage('catgeory must be a string'),
  body('sortBy')
    .optional(),
  body('order')
    .optional(),
  body('limit')
    .optional(),
  body('skip')
    .optional()
    .isint(),
  validator,
  */
  productController.listBySearch
)



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
  //productController.create
)

router.put('/products/:id',
  validateJwt,
  authController.isAdmin,
  productController.updateProduct
)

router.delete('/products/:productId',
  validateJwt,
  authController.isAdmin,
  productController.deleteProduct
)

export default router
