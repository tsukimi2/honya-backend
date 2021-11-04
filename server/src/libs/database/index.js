export const clientOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
}

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

  let connections = {}
  let gfsConnections = {}

  mongoose.Promise = global.Promise

  mongoose.connection.on('connected', () => {
    logger.info('db connection connected...')
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


  const connect = (dburi) => { 
    // connections[dburi] = mongoose.createConnection(dburi, clientOptions)
    connections[dburi] = mongoose.connect(dburi, clientOptions)
    const gfsconnect = mongoose.createConnection(dburi, clientOptions)

    gfsconnect.once('open', () => {
      gfsConnections[dburi] = new mongoose.mongo.GridFSBucket(gfsconnect.db, {
        bucketName: 'photos'
      })
    })

    // connections[dburi].on('error', logger.error.bind(logger, 'db connection error>>'))

//    connections[dburi].once('open', () => {
//      logger.info('db connection opened...')
//    })
    // return connection
  }

/*
  const connect = async (dburi) => {
    connections[dburi] = await mongoose.connect(dburi, clientOptions)
console.log('connections[dburi]')
console.log(connections[dburi])

//    mongoose.connection.once('open', () => {
//      gfsConns[dburi] = new mongoose.mongo.GridFSBucket(connections[dburi].db, {
//        bucketName: 'photos'
//      })
//    })
  }
  */


  const disconnect = dburi => {
    // mongoose.connection.close()
    connections[dburi].close()
  }

  const getConnection = dburi => {
    return connections[dburi]
  }

  const getGfsConnection = dburi => {
    return gfsConnections[dburi]
  }

  return {
    clientOptions,
    connect,
    disconnect,
    getConnection,
    getGfsConnection,
  }
}

export default database
