import config from './config/index.js'
import { database } from '../di-container.js'
import logger from './logger/index.js'

const db = database.connect(config.get('db:mongo:uri'))
db.on('error', () => {
  logger.error('db connection error:')
})
db.once('open', () => {
  logger.info('Connected to db')
})
