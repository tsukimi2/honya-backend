import _ from 'lodash'
import ApplicationError from '../errors/ApplicationError.js'
import DatabaseError from '../errors/DatabaseError.js'

export default class ProductRepos {
  constructor(model) {
    this.model = model
  }

  async create(params) { 
    if(!params || _.isEmpty(params)) {
      throw new ApplicationError('Invalid user params')
    }

    let doc = null
    try {
      doc = new this.model
      for (const [key, value] of Object.entries(params)) {
        doc[key] = value
      }

      await doc.save()
    } catch(err) {
      throw new DatabaseError('DatabaseError', { err })
    }

    return doc    
  }
}