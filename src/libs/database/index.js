const database = ({ mongoose }) => {
  const connect = (dbUri) => {
    mongoose.Promise = global.Promise
    mongoose.connect(dbUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    })

    return mongoose.connection
  }

  const disconnect = () => {
    mongoose.connection.close()
  }

  return {
    connect,
    // disconnect
  }
}

export default database
