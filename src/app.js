import express from 'express'
import cookieParser from 'cookie-parser'
// import cookieSession from 'cookie-session'
import logger from 'morgan'
import { bindRoutes } from './routes/index.js'
import errHandler from './libs/errHandler.js'

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
import './libs/setupMongoose.js'
import './libs/setupPassport.js'

/*
const COOKIE_SESSION_KEY = 'mycookiesessionkey'
const COOKIE_SESSION_KEY2 = 'mycookiesessionkey2',
const COOKIE_SESSION_EXPIRES_IN = 24 * 60 * 60 * 1000 // 24 hours
app.use(cookieSession({
  name: 'session',
  keys: [ COOKIE_SESSION_KEY, COOKIE_SESSION_KEY2 ],
  maxAge: COOKIE_SESSION_EXPIRES_IN
}))
*/
app.use(cookieParser());

bindRoutes(app)

app.use(errHandler)

export default app;
