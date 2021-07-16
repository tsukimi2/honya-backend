import { database } from '../src/di-container.js'
import config from '../src/libs/config/index.js'

export async function mochaGlobalSetup() {
  const db = database.connect(config.get('db:mongo:uri'))
  db.on('error', () => {
    console.error('db connection error:')
  })
}
