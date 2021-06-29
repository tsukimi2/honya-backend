import winston from 'winston'

let options = {
  console: {
    level: 'debug',
    handleExceptions: true,
    json: false,
    colorize: true,
  },
  fileCombinedLog: {
    level: 'info',
    filename: './logs/combined.log',
    handleExceptions: true,
    json: true,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
    colorsize: false,
  },
  fileErrLog: {
    level: 'error',
    filename: './logs/error.log',
    handleExceptions: true,
    json: true,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
    colorsize: false,
  }
}

export const fileCombinedLogTransport = new winston.transports.File(options.fileCombinedLog)
export const fileErrLogTransport = new winston.transports.File(options.fileErrLog)
export const consoleTransport = new winston.transports.Console(options.console)

const logger = winston.createLogger({
  levels: winston.config.npm.levels,
  transports: [
    consoleTransport
  ],
  exitOnError: false
})

export default logger