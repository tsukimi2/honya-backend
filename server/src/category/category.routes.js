import express from 'express'
import { body } from 'express-validator'
import validator from '../libs/validator.js'
import { validateJwt } from '../auth/jwt.js'
import { authController, categoryController } from '../di-container.js'

const router = express.Router()

router.get('/categories/:id', categoryController.getCategoryById)

router.get('/categories', categoryController.getCategories)

router.post('/category',
  validateJwt,
  authController.isAdmin,
  body('name')
    .isLength({ min: 1, max: 50 })
    .withMessage('Category name must have length between 1 and 50'),
  validator,
  categoryController.createCategory
)

export default router