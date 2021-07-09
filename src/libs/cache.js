import mongoose from 'mongoose'
import redis from 'redis'
import util from 'util'
import config from './config/index.js'

const redisUrl = config.get('db:redis:uri')
const client = redis.createClient(redisUrl)
client.hget = util.promisify(client.hget)
const exec = mongoose.Query.prototype.exec

const clearHash = (hashKey) => {
  client.del(JSON.stringify(hashKey))
}

export const cleanCache = async (req, res, next) => {
  await next()

  clearHash(req.user._id)
}

mongoose.Query.prototype.cache = function(options = {}) {
  this.useCache = true
  this.hashKey = JSON.stringify(options.key || '')

  return this
}

mongoose.Query.prototype.exec = async function() {
  if(!this.useCache) {
    return exec.apply(this, arguments)
  }

  const key = JSON.stringify(
    Object.assign({}, this.getQuery(), {
      collection: this.mongooseCollection.name
    })
  )

  // See if we have a value for 'key' in redis
  const cacheValue = await client.hget(this.hashKey, key)

  // If we do, return that
  if(cacheValue) {
    const doc = JSON.parse(cacheValue)
    return Array.isArray(doc) ? doc.map(d => new this.model(d)) : new this.model(doc)
  }

  // Otherwise, issue the query to mongodb and store the result in redis
  const result = await exec.apply(this, arguments)
  client.hset(this.hashKey, key, JSON.stringify(result), 'EX', 10)

  return result
}