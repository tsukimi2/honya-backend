import { expect } from 'chai'
import request from 'supertest'
import app from '../../../../src/app.js'
import config from '../../../../src/libs/config/index.js'
import User from '../../../../src/user/user.model.js'
import { generateUserParams, generateUser} from '../../../factories/userFactory.js'

const API_PREFIX = config.get('app:api_prefix')

describe('Delete user', () => {
  describe(API_PREFIX + '/users/:uid', () => {
    let userParams = null
    let user2Params = null
    let user = null
    let user2 = null
    let res = null
  
    before(async () => {
      res = null
  
      try {
        await User.deleteMany({ "username": /^user*/ })
        userParams = await generateUserParams({})
        user2Params = await generateUserParams({ optParams: {
          username: 'user2'
        }})
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

    beforeEach(async () => {
      try {
        await User.deleteMany({ "username": /^user*/ })
        user = await generateUser({ providedUserParams: userParams })
        user2 = await generateUser({ providedUserParams: user2Params })
      } catch(e) {
        console.log(e)
      }
    })

    afterEach(async () => {
      try {
        await User.deleteMany({ "username": /^user*/ })
      } catch(e) {
        console.log(e)
      }
    })

    context('user logged in and try to delete his own profile', () => {
      let accessToken = ''
      let refreshToken = ''
      const loginHash = 'userdummyhash'
  
      beforeEach(async () => {
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
  
      afterEach(async () => {
        await request(app)
          .get(`${API_PREFIX}/logout`)
          .set('Accept', 'application/json')
      })

      it('should delete user with valid user id', async () => {
        const userId = user._id.toString()
        res = await request(app)
          .delete(`${API_PREFIX}/users/${userId}`)
          .set('Cookie', [`accessToken=${accessToken};refreshToken=${refreshToken};loginHash=${loginHash}`])

        expect(res.status).to.eq(204)
      })
    })

    context('user logged in and try to delete aother user profile', () => {
      let accessToken = ''
      let refreshToken = ''
      const loginHash = 'userdummyhash'
  
      beforeEach(async () => {
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
  
      afterEach(async () => {
        await request(app)
          .get(`${API_PREFIX}/logout`)
          .set('Accept', 'application/json')
      })

      it('should throw ForbiddenError when user tries to delete another user profile', async () => {
        const user2Id = user2._id.toString()

        res = await request(app)
          .delete(`${API_PREFIX}/users/${user2Id}`)
          .set('Cookie', [`accessToken=${accessToken};refreshToken=${refreshToken};loginHash=${loginHash}`])
          .expect(403, {
            err: 'ForbiddenError',
            errmsg: 'Access denied'
          })
      })
    })

    context('user not logged in', () => {
      it('should trhow ForbiddenError when user tries to delete user profile without logging in', async () => {
        const user2Id = user2._id.toString()

        res = await request(app)
          .delete(`${API_PREFIX}/users/${user2Id}`)
          .expect(403, {
            err: 'ForbiddenError',
            errmsg: 'Forbidden access'
          })
      })
    })
  })
})