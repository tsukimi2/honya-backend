const database = ({ mongoose, logger }) => {
  /*
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
  */

  mongoose.Promise = global.Promise

  const clientOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  }

  mongoose.connection.on('connected', () => {
    logger.info('db connection opened...')
  })

  mongoose.connection.on('error', err => {
    logger.error('db connection error')
  })

  mongoose.connection.on('disconnected', () => {
    logger.info('db connection disconnected...')
  })

  // If the Node process ends, close the Mongoose connection
  process.on('SIGINT', () => {
    mongoose.connection.close(() => {
      logger.info('db connection disconnected due to app termination')
      process.exit(0)
    })
  })

  let connections = {}

  const connect = (dburi) => {
    // connections[dburi] = mongoose.createConnection(dburi, clientOptions)
    connections[dburi] = mongoose.connect(dburi, clientOptions)
    
    // connections[dburi].on('error', logger.error.bind(logger, 'db connection error>>'))

/*
    connections[dburi].once('open', () => {
      logger.info('db connection opened...')
    })
*/
    // return connection
  }

  const disconnect = dburi => {
    // mongoose.connection.close()
    connections[dburi].close()
  }

  const getConnection = dburi => {
    return connections[dburi]
  }

  return {
    clientOptions,
    connect,
    disconnect,
    getConnection,
  }
}

export default database
