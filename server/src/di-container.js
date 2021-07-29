import mongoose from 'mongoose'
import config from './libs/config/index.js'
import logger from './libs/logger/index.js'
import Database from './libs/database/index.js'
import ErrHandler from './libs/errHandler.js'
import AuthController from './auth/auth.controller.js'
import UserController from './user/user.controller.js'
import UserService from './user/user.service.js'
import UserRepos from './user/user.repos.js'
import User from './user/user.model.js'
import CategoryController from './category/category.controller.js'
import CategoryService from './category/category.service.js'
import CategoryRepos from './category/category.repos.js'
import Category from './category/category.model.js'

export const errHandler = ErrHandler({ logger })
export const database = Database({ mongoose, logger })
export const userRepos = new UserRepos(User)
export const userService = UserService({ userRepos })
export const categoryRepos = new CategoryRepos(Category)
export const categoryService = CategoryService({ categoryRepos })
export const categoryController = CategoryController({ categoryService, logger })
export const authController = AuthController({ config, logger, userService })
export const userController = UserController({ logger, userService })
