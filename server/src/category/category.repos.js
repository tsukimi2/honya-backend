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

    const category = new this.model
    for (const [key, value] of Object.entries(params)) {
      category[key] = value
    }

    await category.save()

    return category
  }
}