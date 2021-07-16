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

export const errHandler = ErrHandler({ logger })
export const database = Database({ mongoose })
export const userRepos = new UserRepos(User)
export const userService = UserService({ userRepos })
export const authController = AuthController({ config, logger, userService })
export const userController = UserController({ logger, userService })
