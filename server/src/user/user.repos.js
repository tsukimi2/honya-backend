import _ from 'lodash'
import NotFoundError from '../errors/NotFoundError.js'

export default class UserRepos {
  constructor(model) {
    this.model = model
  }

  async getUserById(id, opts={}) {
    return opts.lean ? await this.model.findById(id).lean() : await this.model.findById(id).exec()
  }

  async getUser(filterParams, opts={}) {
    return opts.lean ? await this.model.findOne(filterParams).lean() : await this.model.findOne(filterParams).exec()
  }

  async createUser(params) {
    let user = new this.model
    
    for (const [key, value] of Object.entries(params)) {
      user[key] = value
    }
    await user.save()

    return user
  }

  async deleteUser(filterParams) {
    if(!filterParams || _.isEmpty(filterParams)) {
      throw new NotFoundError('Empty filter params when deleting user')
    }
    await this.model.deleteOne(filterParams)
  }

  async updateLoginHashAndRefreshToken(filterParams, updateParams={}) {
    await this.model.updateLoginHashAndRefreshToken(filterParams, updateParams)
  }
}