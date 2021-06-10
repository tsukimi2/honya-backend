import mongoose from 'mongoose'
import config from './config/index.js'

mongoose.connect(config.get('db:uri'), {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
})

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'db connection error:'))
db.once('open', () => {
  console.info('Connected to db')
})