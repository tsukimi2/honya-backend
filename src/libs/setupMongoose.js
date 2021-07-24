import config from './config/index.js'
import { database } from '../di-container.js'

try {
  // mongodb://mongo/honya
  const dburi = `mongodb://${config.get('db:mongo:host')}:${config.get('db:mongo:port')}/${config.get('db:mongo:schema')}`
console.log('dburi')  
console.log(dburi)
  const db = database.connect(dburi)
} catch(err) {
  console.log('err')
  console.log(err)
}
