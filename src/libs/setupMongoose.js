import config from './config/index.js'
import { database } from '../di-container.js'
import logger from './logger/index.js'

console.log('dburi')
console.log(config.get('db:mongo:uri'))

const db = database.connect(config.get('db:mongo:uri'))
db.on('error', () => {
  logger.error('db connection error:')
})
db.once('open', () => {
  logger.info('Connected to db')
})
