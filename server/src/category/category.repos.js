import _ from 'lodash'
import ApplicationError from '../errors/ApplicationError.js'
import DatabaseError from '../errors/DatabaseError.js'

export default class CategoryRepos {
  constructor(model) {
    this.model = model
  }

  async getOne(filterParams={}, opts={}) {
    let doc = null

    try {
      let query = this.model.findOne(filterParams)
      if(Array.isArray(opts.selectParams) && opts.selectParams.length !== 0) {
        query.select(opts.selectParams)
      }

      if(opts.lean) {
        doc = await query.lean()
      } else {
        doc = await query.exec()
      }
    } catch(err) {
      throw new DatabaseError('cannot find document', { err })
    }

    return doc
  }

  async createCategory(params) {
    if(!params || _.isEmpty(params)) {
      throw new ApplicationError('Invalid user params')
    }

    const doc = new this.model
    for (const [key, value] of Object.entries(params)) {
      doc[key] = value
    }

    await doc.save()

    return doc
  }
}