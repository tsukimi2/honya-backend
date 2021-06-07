import mongoose from 'mongoose'

mongoose.connect('mongodb://localhost/honya', {
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