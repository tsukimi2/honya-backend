import morgan from 'morgan'
import json from 'morgan-json'
import logger from './index.js'
import config from '../config/index.js'

const format = json({
  method: ':method',
  url: ':url',
  status: ':status',
  contentLength: ':res[content-length]',
  responseTime: ':response-time'
})

const httpLogger = morgan(format, {
  skip: (req, res) => config.get('app:node_env') === 'test',
  stream: {
    write: (message) => {
      const {
        method,
        url,
        status,
        contentLength,
        responseTime
      } = JSON.parse(message)

      logger.info('HTTP Access Log', {
        timestamp: new Date().toString(),
        method,
        url,
        status: Number(status),
        contentLength,
        responseTime: Number(responseTime)
      })
    }
  }
})

export default httpLogger
