import nconf from 'nconf'

function Config() {
  const env = process.env.NODE_ENV || 'dev'

  nconf.argv()
    .env()
    .file(env, 'src/config/config.' + env + '.json')
    .file('default', 'src/config/config.default.json')
  // nconf.file(env, 'src/config/config.' + env + '.json')
  // nconf.file('default', 'src/config/config.default.json')

  nconf.set('app:node_env', env)

  if(process.env.MONGO_HOST) {
    nconf.set('db:mongo:host', process.env.MONGO_HOST)
  }
  if(process.env.MONGO_PORT) {
    nconf.set('db:mongo:port', process.env.MONGO_PORT)
  }
  if(process.env.REDIS_HOST) {
    nconf.set('db:redis:host', process.env.REDIS_HOST)
  }
  if(process.env.REDIS_PORT) {
    nconf.set('db:redis:port', process.env.REDIS_PORT)
  }

  if(process.env.JWT_SECRET) {
    nconf.set('security:jwt:secret', process.env.JWT_SECRET)
  }
  if(process.env.ACCESS_TOKEN_EXPIRES_IN) {
    nconf.set('security:jwt:access_token_expires_in', process.env.ACCESS_TOKEN_EXPIRES_IN)
  }
  if(process.env.ACCESS_TOKEN_EXPIRES_IN_SEC) {
    nconf.set('security:jwt:access_token_expires_in_sec', parseInt(process.env.ACCESS_TOKEN_EXPIRES_IN_SEC))
  }
  if(process.env.REFRESH_TOKEN_EXPIRES_IN) {
    nconf.set('security:jwt:refresh_token_expires_in', process.env.REFRESH_TOKEN_EXPIRES_IN)
  }
  if(process.env.REFRESH_TOKEN_EXPIRES_IN_SEC) {
    nconf.set('security:jwt:refresh_token_expires_in_sec', process.env.REFRESH_TOKEN_EXPIRES_IN_SEC)
  }
  nconf.set('security:password:saltrounds', parseInt(process.env.SALTROUNDS))

  if(process.env.BRAINTREE_MERCHANT_ID) {
    nconf.set('security:payment:braintree:merchant_id', process.env.BRAINTREE_MERCHANT_ID)
  }
  if(process.env.BRAINTREE_PUBLIC_KEY) {
    nconf.set('security:payment:braintree:public_key', process.env.BRAINTREE_PUBLIC_KEY)
  }
  if(process.env.BRAINTREE_PRIVATE_KEY) {
    nconf.set('security:payment:braintree:private_key', process.env.BRAINTREE_PRIVATE_KEY)
  }
}

Config.prototype.get = function(key) {
  return nconf.get(key)
}

export default new Config()