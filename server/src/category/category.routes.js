import express from 'express'
import { body } from 'express-validator'
import validator from '../libs/validator.js'
import { validateJwt } from '../auth/jwt.js'
import { categoryController } from '../di-container.js'

const router = express.Router()

router.post('/category',
  validateJwt,
  body('name')
    .isLength({ min: 1, max: 50 })
    .withMessage('Category name must have length between 1 and 50'),
  validator,
  categoryController.createCategory
)

export default router