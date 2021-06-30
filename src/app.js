import express from 'express'
import cookieParser from 'cookie-parser'
import httpLogger from './libs/logger/httpLogger.js'
import { bindRoutes } from './routes/index.js'
import errHandler from './libs/errHandler.js'
import { isOperationalError } from './libs/errHandler.js'
import logger from './libs/logger/index.js'

const app = express();

import './libs/logger/setupLogger.js'
app.use(httpLogger)

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
import './libs/setupMongoose.js'
import './libs/setupPassport.js'

app.use(cookieParser());

bindRoutes(app)

process.on('unhandledRejection', err => {
  throw err
})
process.on('uncaughtException', err => {
  logger.error(err)

  if(!isOperationalError(err)) {
    process.exit(1)
  }
})

app.use(errHandler)

export default app;
