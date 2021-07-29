import _ from 'lodash'
import NotFoundError from '../errors/NotFoundError.js'
import ApplicationError from '../errors/ApplicationError.js'

export default class UserRepos {
  constructor(model) {
    this.model = model
  }

  setModel(model) {
    this.model = model
  }

  async getUserById(id, opts={}) {
    if(!id) {
      throw new ApplicationError('Invalid user id')
    }

    return opts.lean ? await this.model.findById(id).lean() : await this.model.findById(id).exec()
  }

  async getUser(filterParams, opts={}) {
    if(!filterParams || _.isEmpty(filterParams)) {
      throw new ApplicationError('Invalid user params')
    }

    return opts.lean ? await this.model.findOne(filterParams).lean() : await this.model.findOne(filterParams).exec()
  }

  async createUser(params) { 
    if(!params || _.isEmpty(params)) {
      throw new ApplicationError('Invalid user params')
    }

    let user = new this.model
    for (const [key, value] of Object.entries(params)) {
      user[key] = value
    }
    await user.save()

    return user
  }

  async deleteUser(filterParams) {
    if(!filterParams || _.isEmpty(filterParams)) {
      throw new ApplicationError('Empty filter params when deleting user')
    }
    await this.model.deleteOne(filterParams)
  }

  async updateLoginHashAndRefreshToken(filterParams, updateParams={}) {
    await this.model.updateLoginHashAndRefreshToken(filterParams, updateParams)
  }
}