import express from 'express'
import cookieParser from 'cookie-parser'
import logger from 'morgan'
import { bindRoutes } from './routes/index.js'

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
import './libs/setupMongoose.js'
import './libs/setupPassport.js'
app.use(cookieParser());

bindRoutes(app)

export default app;
