const database = ({ mongoose }) => {
  const connect = (dbUri) => {
    mongoose.connect(dbUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    })

    return mongoose.connection
  }

  return {
    connect
  }
}

export default database
