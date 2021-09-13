import { expect } from 'chai'
import request from 'supertest'
import app from '../../../../src/app.js'
import config from '../../../../src/libs/config/index.js'
import User from '../../../../src/user/user.model.js'
import { generateUserParams, generateUser} from '../../../factories/userFactory.js'

const API_PREFIX = config.get('app:api_prefix')

describe('Update user', () => {
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
  
    context('user logged in and try to update his own user info', () => {
      let accessToken = ''
      let refreshToken = ''
      const loginHash = 'userdummyhash'
  
      before(async () => {
        const res = await request(app)
          .post(`${API_PREFIX}/login`)
          .send(`username=${userParams.username}`)
          .send(`password=${userParams.password}`)
          .set('Accept', 'application/json')

        accessToken = res.body.access_token
        refreshToken = res.body.refresh_token
      })
  
      after(async () => {
        await request(app)
          .get(`${API_PREFIX}/logout`)
          .set('Accept', 'application/json')
      })
  
      it('should update user with valid user id and update param password but screen out fields not belonging to user model', async () => {
        const userId = user._id.toString()
        const oldPassword = userParams.password
        const newPassword = 'testing2'
        const oldHashedPassword = user.oldHashedPassword
        let updatedUser = null

        res = await request(app)
          .patch(`${API_PREFIX}/users/${userId}`)
          .send({ password: newPassword, dummy: 'dummy' })
          .set('Cookie', [`accessToken=${accessToken};refreshToken=${refreshToken};loginHash=${loginHash}`])
          .expect(200)
        updatedUser = await User.findById(user._id)
  
        expect(res.body.data).to.exist
        expect(res.body.data.user).to.exist
        expect(res.body.data.user).to.have.property('_id').to.eq(user._id.toString())
        expect(updatedUser.oldHashedPassword).to.eq(oldHashedPassword)
        expect(updatedUser).to.not.have.property('dummy')
        
        await request(app)
          .patch(`${API_PREFIX}/users/${userId}`)
          .send({ password: oldPassword })
          .set('Cookie', [`accessToken=${accessToken};refreshToken=${refreshToken};loginHash=${loginHash}`])
      })
  
      context('Testing password to update', () => {
        it('should throw BadRequestError with valid user id but no param to update', async () => {
          const userId = user._id.toString()
  
          res = await request(app)
            .patch(`${API_PREFIX}/users/${userId}`)
            .set('Cookie', [`accessToken=${accessToken};refreshToken=${refreshToken};loginHash=${loginHash}`])
            .expect(400)
  
          expect(res.body).to.have.property('err').to.eq('BadRequestError')
          expect(res.body).to.have.property('errmsg').to.eq('no param to update')
        })
  
        it('should throw BadRequestError with valid user id but password to update is the same as stored password', async () => {
          const userId = user._id.toString()
          const oldPassword = userParams.password

          res = await request(app)
            .patch(`${API_PREFIX}/users/${userId}`)
            .send({ password: oldPassword })
            .set('Cookie', [`accessToken=${accessToken};refreshToken=${refreshToken};loginHash=${loginHash}`])
            .expect(400)
  
          expect(res.body).to.have.property('err').to.eq('BadRequestError')
          expect(res.body).to.have.property('errmsg').to.eq('password to update is the same as the existing password')
        })
  
        it('should throw BadRequestError with valid user id but empty password', async () => {
          const userId = user._id.toString()
          const oldPassword = ''

          res = await request(app)
            .patch(`${API_PREFIX}/users/${userId}`)
            .send({ password: oldPassword, dummy: 'dummy' })
            .set('Cookie', [`accessToken=${accessToken};refreshToken=${refreshToken};loginHash=${loginHash}`])
            .expect(400)
  
          expect(res.body).to.have.property('err').to.eq('BadRequestError')
          expect(res.body).to.have.property('errmsg').to.eq('password must be between 8 and 20 characters')
        })
  
        it('should throw BadRequestError with valid user id but password length less than 8', async () => {
          const userId = user._id.toString()
          const oldPassword = '1234567'

          res = await request(app)
            .patch(`${API_PREFIX}/users/${userId}`)
            .send({ password: oldPassword })
            .set('Cookie', [`accessToken=${accessToken};refreshToken=${refreshToken};loginHash=${loginHash}`])
            .expect(400)
  
          expect(res.body).to.have.property('err').to.eq('BadRequestError')
          expect(res.body).to.have.property('errmsg').to.eq('password must be between 8 and 20 characters')
        })
  
        it('should throw BadRequestErorr with valid user id but password length greater than 20', async () => {
          const userId = user._id.toString()
          const oldPassword = '123456789012345678901'
  
          res = await request(app)
            .patch(`${API_PREFIX}/users/${userId}`)
            .send({ password: oldPassword })
            .set('Cookie', [`accessToken=${accessToken};refreshToken=${refreshToken};loginHash=${loginHash}`])
            .expect(400)
  
          expect(res.body).to.have.property('err').to.eq('BadRequestError')
          expect(res.body).to.have.property('errmsg').to.eq('password must be between 8 and 20 characters')
        })
      })
    })
  
    context('user logged in and try to update someone else user info', () => {
      let accessToken = ''
      let refreshToken = ''
      const loginHash = 'userdummyhash'
  
      before(async () => {
        const res = await request(app)
          .post(`${API_PREFIX}/login`)
          .send(`username=${userParams.username}`)
          .send(`password=${userParams.password}`)
          .set('Accept', 'application/json')

        accessToken = res.body.access_token
        refreshToken = res.body.refresh_token
      })
  
      after(async () => {
        await request(app)
          .get(`${API_PREFIX}/logout`)
          .set('Accept', 'application/json')
      })
  
      it('should throw ForbiddenError', async () => {
        const user2Id = user2._id.toString()
        const newPassword = 'testing2'

        res = await request(app)
          .patch(`${API_PREFIX}/users/${user2Id}`)
          .send({ password: newPassword })
          .set('Cookie', [`accessToken=${accessToken};refreshToken=${refreshToken};loginHash=${loginHash}`])
          .set('Accept', 'application/json')
          .expect(403, {
            err: 'ForbiddenError',
            errmsg: 'Access denied'
          })
      })
    })
  
    context('not logged in', () => {
      it('should throw ForbiddenError', async () => {
        const userId = user._id.toString()
        const newPassword = 'testing2'

        res = await request(app)
          .patch(`${API_PREFIX}/users/${userId}`)
          .send({ password: newPassword })
          .expect(403)
  
        expect(res.body).to.have.property('err').to.eq('ForbiddenError')
        expect(res.body).to.have.property('errmsg').to.eq('Forbidden access')
      })
    })
  })
})
