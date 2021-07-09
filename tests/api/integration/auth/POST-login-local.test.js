import { expect } from 'chai'
import request from 'supertest'
import app from '../../../../src/app.js'
import config from '../../../../src/libs/config/index.js'
import User from '../../../../src/user/user.model.js'

const API_PREFIX = config.get('app:api_prefix')

describe(API_PREFIX + '/login', () => {
  let username = 'user'
  let user = {
    username,
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
      /*
      .end(function(err, res) {
        if (err) throw err;
      })
      */
  })

  beforeEach(async () => {
    username = 'user'
    user = {
      username,
      password: 'testing1',
    }
  })

  it('should login successfully with valid username and password', async () => {
    const storedUser = await User.findOne({ "username": user.username })
    console.log('storedUser')
    console.log(storedUser)

    const res = await request(app)
      .post(API_PREFIX + '/login')
      .send(`username=${user.username}`)
      .send(`password=${user.password}`)
      .set('Accept', 'application/json')
      .expect(200)

    expect(res.body.access_token).to.exist
    expect(res.body.refresh_token).to.exist
    expect(res.body.token_type).to.exist
    expect(res.body.token_type).to.eql('bearer')
    expect(res.body.expires_in).to.exist
  })

  it('shoudl fail login with incorrect username', async () => {
    user.username = 'baka'

    const res = await request(app)
      .post(API_PREFIX + '/login')
      .send(`username=${user.username}`)
      .send(`password=${user.password}`)
      .set('Accept', 'application/json')
      .expect(401)

    expect(res.body.err).to.eql('AuthErr')
    expect(res.body.errmsg).to.eql('Invalid username/password')
  })

  it('should fail login with incorrect password', async () => {
    user.password = 'bakamono'

    const res = await request(app)
      .post(API_PREFIX + '/login')
      .send(`username=${user.username}`)
      .send(`password=${user.password}`)
      .set('Accept', 'application/json')
      .expect(401)
      
    expect(res.body.err).to.eql('AuthErr')
    expect(res.body.errmsg).to.eql('Invalid username/password')
  })

  it('should fail login with missing username', async () => {
    user.username = ''

    await request(app)
      .post(API_PREFIX + '/login')
      .send(`username=${user.username}`)
      .send(`password=${user.password}`)
      .set('Accept', 'application/json')
      .expect(400)
  })

  it('should fail login with missing password', async () => {
    user.password = ''

    await request(app)
      .post(API_PREFIX + '/login')
      .send(`username=${user.username}`)
      .send(`password=${user.password}`)
      .set('Accept', 'application/json')
      .expect(400)
  })
})