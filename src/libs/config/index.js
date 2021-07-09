import nconf from 'nconf'

function Config() {
  const env = process.env.NODE_ENV || 'dev'
  nconf.file(env, 'src/config/config.' + env + '.json')
  nconf.file('default', 'src/config/config.default.json')

  nconf.set('app:node_env', env)
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
}

Config.prototype.get = function(key) {
  return nconf.get(key)
}

export default new Config()