import winston from 'winston'
const { combine, timestamp, label, printf, errors, json, prettyPrint } = winston.format

let options = {
  console: {
    level: 'debug',
    handleExceptions: true,
    json: true,
    timestamp: true,
    colorize: true,
  },
  fileCombinedLog: {
    level: 'info',
    filename: './logs/combined.log',
    handleExceptions: true,
    json: true,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
    colorize: false,
    timestamp: true,
  },
  fileCombinedLog: {
    level: 'warn',
    filename: './logs/combined.log',
    handleExceptions: true,
    json: true,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
    colorize: false,
    timestamp: true,
  },
  fileErrLog: {
    level: 'error',
    filename: './logs/error.log',
    handleExceptions: true,
    json: true,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
    colorize: false,
    timestamp: true,
  }
}

export const fileCombinedLogTransport = new winston.transports.File(options.fileCombinedLog)
export const fileErrLogTransport = new winston.transports.File(options.fileErrLog)
export const consoleTransport = new winston.transports.Console(options.console)

const logger = winston.createLogger({
  levels: winston.config.npm.levels,
  format: combine(
    // label({ label: '' }),
    errors({ stack: true }), // <-- use errors format
    timestamp(),
    json(),
  ),
  transports: [
    consoleTransport
  ],
  exitOnError: false
})

export default logger