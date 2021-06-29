import logger from './index.js'
import { fileCombinedLogTransport, fileErrLogTransport } from './index.js'
import config from '../config/index.js'

if(config.get('app:node_env') === 'prod') {
  logger.add(fileCombinedLogTransport)
    .add(fileErrLogTransport)
}
