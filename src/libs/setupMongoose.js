import mongoose from 'mongoose'
import config from './config/index.js'
import logger from '../libs/logger/index.js'

mongoose.connect(config.get('db:uri'), {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
})

const db = mongoose.connection;
//db.on('error', logger.error.bind(console, 'db connection error:'))
db.on('error', () => {
  logger.error('db connection error:')
})
db.once('open', () => {
  logger.info('Connected to db')
})