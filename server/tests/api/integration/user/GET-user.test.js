import { expect } from 'chai'
import request from 'supertest'
import app from '../../../../src/app.js'
import config from '../../../../src/libs/config/index.js'
import User from '../../../../src/user/user.model.js'
import { generateUserParams, generateUser} from '../../../factories/userFactory.js'

const API_PREFIX = config.get('app:api_prefix')

describe(API_PREFIX + '/users/:uid', () => {
  let userParams = null
  let user2Params = null
  let user = null
  let user2 = null
  let res = null
  
  before(async () => {
    res = null

    try {
      userParams = generateUserParams({})
      user2Params = generateUserParams({ optParams: {
        username: 'user2'
      }})
      await User.deleteMany({ "username": /^user*/ })
      user = await generateUser({ providedUserParams: userParams })
      user2 = await generateUser({ providedUserParams: user2Params })
    } catch(e) {
      console.log(e)
    }
  })

  after(async () => {
    try {
      await User.deleteMany({ "username": /^user*/ })
    } catch(e) {
      console.log(e)
    }
  })

  context('user logged in and try to get his own user info', () => {
    let accessToken = ''
    let refreshToken = ''
    const loginHash = 'userdummyhash'

    before(async () => {
      try {
        const res = await request(app)
          .post(`${API_PREFIX}/login`)
          .send(`username=${userParams.username}`)
          .send(`password=${userParams.password}`)
          .set('Accept', 'application/json')

        accessToken = res.body.access_token
        refreshToken = res.body.refresh_token        
      } catch(e) {
        console.log(e)
      }
    })

    after(async () => {
      await request(app)
        .get(`${API_PREFIX}/logout`)
        .set('Accept', 'application/json')
    })

    it('should get user with valid user id', async () => {
      const userId = user._id.toString()
      try {
        res = await request(app)
          .get(`${API_PREFIX}/users/${userId}`)
          .set('Cookie', [`accessToken=${accessToken};refreshToken=${refreshToken};loginHash=${loginHash}`])
          .expect(200)
      } catch(e) {    
        console.log(e)
      }

      expect(res.body.data).to.exist
      expect(res.body.data).to.have.property('user')
      expect(res.body.data.user).to.have.property('_id').to.eq(user._id.toString())
      expect(res.body.data.user).to.have.property('username').to.eq(user.username)
      expect(res.body.data.user).to.have.property('email').to.eq(user.email)
    })
  })

  context('user logged in and try to get someone else user info', () => {
    let accessToken = ''
    let refreshToken = ''
    const loginHash = 'userdummyhash'

    before(async () => {
      try {
        const res = await request(app)
          .post(`${API_PREFIX}/login`)
          .send(`username=${userParams.username}`)
          .send(`password=${userParams.password}`)
          .set('Accept', 'application/json')

        accessToken = res.body.access_token
        refreshToken = res.body.refresh_token        
      } catch(e) {
        console.log(e)
      }
    })

    after(async () => {
      await request(app)
        .get(`${API_PREFIX}/logout`)
        .set('Accept', 'application/json')
    })

    it('should throw ForbiddenError', async () => {
      const user2Id = user2._id.toString()
      try {
        res = await request(app)
          .get(`${API_PREFIX}/users/${user2Id}`)
          .set('Cookie', [`accessToken=${accessToken};refreshToken=${refreshToken};loginHash=${loginHash}`])
          .expect(403)
      } catch(e) {    
        console.log(e)
      }

      expect(res.body).to.have.property('err').to.eq('ForbiddenError')
      expect(res.body).to.have.property('errmsg').to.eq('Access denied')
    })
  })

  context('not logged in', () => {
    it('should throw ForbiddenError', async () => {
      const user2Id = user2._id.toString()
      try {
        res = await request(app)
          .get(`${API_PREFIX}/users/${user2Id}`)
          .expect(403)
      } catch(e) {    
        console.log(e)
      }

      expect(res.body).to.have.property('err').to.eq('ForbiddenError')
      expect(res.body).to.have.property('errmsg').to.eq('Forbidden access')
    })
  })
})