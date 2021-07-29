import { expect } from 'chai'
import request from 'supertest'
import app from '../../../../src/app.js'
import config from '../../../../src/libs/config/index.js'
import { ROLE } from '../../../../src/user/user.constants.js'
import User from '../../../../src/user/user.model.js'

const API_PREFIX = config.get('app:api_prefix')

describe(API_PREFIX + '/register', () => {
  let username = ''
  let user = null

  beforeEach(async () => {
    username = 'user'
    user = {
      username,
      password: 'testing1',
      email: `${username}@gmail.com`
    }

    try {    
      await User.deleteMany({ "username": /^user*/ })
    } catch(err) {
      console.log(err)
    }
  })

  it('should registers a new user with default role user successfully with valid username, password, and email and without role param', async () => {
    await request(app)
      .post(API_PREFIX + '/register')
      .send(`username=${user.username}`)
      .send(`password=${user.password}`)
      .send(`email=${user.email}`)
      .set('Accept', 'application/json')
      .expect(201, {
        data: {
          user: {
            username: user.username,
            email: user.email,
            role: ROLE.USER,
          }
        }
      })
  })

  it('should registers a new user successfully with valid username, password, email and role', async () => {
    const role = ROLE.ADMIN

    await request(app)
      .post(API_PREFIX + '/register')
      .send(`username=${user.username}`)
      .send(`password=${user.password}`)
      .send(`email=${user.email}`)
      .send(`role=${ROLE.ADMIN}`)
      .set('Accept', 'application/json')
      .expect(201, {
        data: {
          user: {
            username: user.username,
            email: user.email,
            role
          }
        }
      })
  })

  it('should not register a user with existing username or existing email', async () => {
    await request(app)
      .post(API_PREFIX + '/register')
      .send(`username=${user.username}`)
      .send(`password=${user.password}`)
      .send(`email=${user.email}`)
      .set('Accept', 'application/json')
      .expect(201)

    await request(app)
      .post(API_PREFIX + '/register')
      .send(`username=${user.username}`)
      .send(`password=${user.password}`)
      .send(`email=${user.email}`)
      .set('Accept', 'application/json')     
      .expect(400, {
        err: "DatabaseError",
        errmsg: "Duplicate key error"
      })   
  })

  it('should not register a user with empty username, password, or email', async () => {
    user = {
      username: '',
      password: '',
      email: ''
    }

    const result = await request(app)
      .post(API_PREFIX + '/register')
      .send(`username=${user.username}`)
      .send(`password=${user.password}`)
      .send(`email=${user.email}`)
      .set('Accept', 'application/json')
      .expect(400)

    expect(result.body.err).to.exist
    expect(result.body.err).to.eql('BadRequestError')
  })

  it('should not register a user with username less than 3 characters or greater than 20 characters', async () => {
    user.username = 'ab'

    const result = await request(app)
      .post(API_PREFIX + '/register')
      .send(`username=${user.username}`)
      .send(`password=${user.password}`)
      .send(`email=${user.email}`)
      .set('Accept', 'application/json')
      .expect(400)

    expect(result.body.err).to.exist
    expect(result.body.err).to.eql('BadRequestError')
  })

  it('should not register a user with password less than 8 characters or greater than 20 characters', async () => {
    user.password = '1234567'

    const result = await request(app)
      .post(API_PREFIX + '/register')
      .send(`username=${user.username}`)
      .send(`password=${user.password}`)
      .send(`email=${user.email}`)
      .set('Accept', 'application/json')
      .expect(400)

    expect(result.body.err).to.exist
    expect(result.body.err).to.eql('BadRequestError')
  })

  it('should not register a user with invalid email format', async() => {
    user.email = `${username}gmail.com`

    const result = await request(app)
      .post(API_PREFIX + '/register')
      .send(`username=${user.username}`)
      .send(`password=${user.password}`)
      .send(`email=${user.email}`)
      .set('Accept', 'application/json')
      .expect(400)

    expect(result.body.err).to.exist
    expect(result.body.err).to.eql('BadRequestError')
  })
})
