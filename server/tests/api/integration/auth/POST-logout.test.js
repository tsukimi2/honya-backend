import { expect } from 'chai'
import request from 'supertest'
import app from '../../../../src/app.js'
import config from '../../../../src/libs/config/index.js'
import User from '../../../../src/user/user.model.js'

const API_PREFIX = config.get('app:api_prefix')

describe(API_PREFIX + '/logout', () => {
  const username = 'user'
  const user = {
    username: 'user',
    password: 'testing1',
    email: `${username}@gmail.com`
  }

  before(async () => {
    try {
      await User.deleteMany({ "username": /^user*/ })
    } catch(err) {
      console.log(err)
    }

    await request(app)
      .post(API_PREFIX + '/register')
      .send(`username=${user.username}`)
      .send(`password=${user.password}`)
      .send(`email=${user.email}`)
      .set('Accept', 'application/json')

    await request(app)
      .post(API_PREFIX + '/login')
      .send(`username=${user.username}`)
      .send(`password=${user.password}`)
      .set('Accept', 'application/json')
  })

  it('should logout successfully with refresh token removed from storage given existing access and refresh token cookies', async () => {
    const res = await request(app)
      .post(API_PREFIX + '/logout')
      .set('Accept', 'application/json')
      .expect(204)

      expect(res.cookies).not.to.exist
  })
})