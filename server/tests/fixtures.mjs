import { database } from '../src/di-container.js'
import config from '../src/libs/config/index.js'

export async function mochaGlobalSetup() {
  const dburi = `mongodb://${config.get('db:mongo:host')}:${config.get('db:mongo:port')}/${config.get('db:mongo:schema')}`
console.log('dburi')  
console.log(dburi)
  database.connect(dburi)
}
