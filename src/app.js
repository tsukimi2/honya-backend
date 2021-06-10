import express from 'express'
import cookieParser from 'cookie-parser'
import logger from 'morgan'
import { bindRoutes } from './routes/index.js'
import errHandler from './libs/errHandler.js'

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
import './libs/setupMongoose.js'
import './libs/setupPassport.js'

app.use(cookieParser());

bindRoutes(app)

app.use(errHandler)

export default app;
