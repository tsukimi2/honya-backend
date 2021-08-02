import _ from 'lodash'
import ApplicationError from '../errors/ApplicationError.js'
import Repos from '../repos/index.js'

export default class UserRepos extends Repos {
  constructor(model) {
    super(model)
  }

  async updateLoginHashAndRefreshToken(filterParams, updateParams={}) {
    await this.model.updateLoginHashAndRefreshToken(filterParams, updateParams)
  }
}