import _ from 'lodash'
import ApplicationError from '../errors/ApplicationError.js'

export default class CategoryRepos {
  constructor(model) {
    this.model = model
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