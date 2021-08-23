import { MongoClient } from 'mongodb'
import config from '../../src/libs/config/index.js'

// https://www.mongodb.com/languages/javascript/mongodb-and-npm-tutorial
const connectToMongodb = async () => {
  // Connection URL
  const uri = `mongodb://${config.get('db:mongo:host')}:${config.get('db:mongo:port')}`
  const clientOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }

  const mongoClient = new MongoClient(uri, clientOptions)

  try {
    return mongoClient.connect()
  } catch(err) {
    console.log('mongodb connect error')
    console.log(err)
  }

  return null
}

export {
  connectToMongodb
}