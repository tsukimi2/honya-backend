import config from './config/index.js'
import { database } from '../di-container.js'

try {
  const db = database.connect(config.get('db:mongo:uri'))
} catch(err) {
  console.log('err')
  console.log(err)
}
