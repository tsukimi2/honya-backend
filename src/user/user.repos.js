import _ from 'lodash'
import NotFoundError from '../errors/NotFoundError.js'

export default class UserRepos {
  constructor(model) {
    this.model = model
  }

  async getUserById(id, opts={}) {
    return opts.lean ? await this.model.findById(id).lean() : await this.model.findById(id).exec()
  }

  async deleteUser(filterParams) {
    if(!filterParams || _.isEmpty(filterParams)) {
      throw new NotFoundError('Empty filter params when deleting user')
    }
    await this.model.deleteOne(filterParams)
  }

  async updateLoginHashAndRefreshToken(filterParams) {
    await this.model.updateLoginHashAndRefreshToken(filterParams, {
      loginHash: null,
      refreshToken: null,
      refreshTokenExpiresDt: null,
    })
  }
}