import { expect } from 'chai'
import request from 'supertest'
import app from '../../../../src/app.js'
import config from '../../../../src/libs/config/index.js'
import User from '../../../../src/user/user.model.js'
import Category from '../../../../src/category/category.model.js'
import { generateUserParams } from '../../../factories/userFactory.js'

const API_PREFIX = config.get('app:api_prefix')

describe(API_PREFIX + '/category', () => {
  const categoryName1 = 'category1'

  context('Admin logged in', () => {
    let admin = null
    let accessToken = ''
    let refreshToken = ''
    const loginHash = 'admindummyhash'

    before(async () => {
      try {
        admin = await generateUserParams({ userProfile: 'validAdmin1' })
        await User.deleteMany({ "username": /^admin*/ })
        await Category.deleteMany({ "name": /^category*/ })
  
        // register a test admin
        const res0 = await request(app)
          .post(API_PREFIX + '/register')
          .send(`username=${admin.username}`)
          .send(`password=${admin.password}`)
          .send(`email=${admin.email}`)
          .send(`role=${admin.role}`)
          .set('Accept', 'application/json')

        const res = await request(app)
          .post(API_PREFIX + '/login')
          .send(`username=${admin.username}`)
          .send(`password=${admin.password}`)
          .set('Accept', 'application/json')

        accessToken = res.body.access_token
        refreshToken = res.body.refresh_token
      } catch(err) {
        console.log(err)
      }
    })

    after(async () => {
      await User.deleteMany({ "username": /^admin*/ })
      await Category.deleteMany({ "name": /^category*/  })
      await request(app)
        .get(API_PREFIX + '/logout')
        .set('Accept', 'application/json')
    })

    beforeEach(async () => {
      try {
        await Category.deleteMany({ "name": /^category*/  })     
      } catch(err) {
        console.log(err)
      }
    })

    it('should create category successfully with valid category name', async () => {
      const res = await request(app)
        .post(API_PREFIX + '/category')
        .set('Cookie', [`accessToken=${accessToken};refreshToken=${refreshToken};loginHash=${loginHash}`])
        .send({ name: categoryName1 })
        .set('Accept', 'application/json')
        .expect(201)

      expect(res.body.data).to.exist
      expect(res.body.data.category).to.exist
      expect(res.body.data.category).to.have.property('name').to.eq(categoryName1)
    })

    it('should receive BadRequestError with empty category name', async () => {
      const categoryName = ''
      const res = await request(app)
        .post(API_PREFIX + '/category')
        .set('Cookie', [`accessToken=${accessToken};refreshToken=${refreshToken};loginHash=${loginHash}`])
        .send({ name: categoryName })
        .set('Accept', 'application/json')
        .expect(400)

      expect(res.body).to.have.property('err').to.eq('BadRequestError')
      expect(res.body).to.have.property('errmsg').to.eq('Category name must have length between 1 and 50')
    })

    it('should receive BadRequestError with category name greater than length 30', async () => {
      const categoryName = 'abcdefghijabcdefghijabcdefghijabcdefghijabcdefghijk'
      const res = await request(app)
        .post(API_PREFIX + '/category')
        .set('Cookie', [`accessToken=${accessToken};refreshToken=${refreshToken};loginHash=${loginHash}`])
        .send({ name: categoryName })
        .set('Accept', 'application/json')
        .expect(400)

      expect(res.body).to.have.property('err').to.eq('BadRequestError')
      expect(res.body).to.have.property('errmsg').to.eq('Category name must have length between 1 and 50')
    })

    it('should receive Database duplicated key error if category already existed', async () => {
      await request(app)
        .post(API_PREFIX + '/category')
        .set('Cookie', [`accessToken=${accessToken};refreshToken=${refreshToken};loginHash=${loginHash}`])
        .send({ name: categoryName1 })
        .set('Accept', 'application/json')

      const res = await request(app)
        .post(API_PREFIX + '/category')
        .set('Cookie', [`accessToken=${accessToken};refreshToken=${refreshToken};loginHash=${loginHash}`])
        .send({ name: categoryName1 })
        .set('Accept', 'application/json')
        .expect(422)
      expect(res.body).to.have.property('err').to.eq('UnprocessableEntityError')
      expect(res.body).to.have.property('errmsg').to.eq('failed to create category')
    })
  })

  context('User logged in', () => {
    let user = null
    let accessToken = ''
    let refreshToken = ''
    const loginHash = 'userdummyhash'
  
    before(async () => {
      try {
        user = await generateUserParams({ userProfile: 'validUser1' })
        await User.deleteMany({ "username": /^user*/ })
        await Category.deleteMany({ "name": /^category*/  })
  
        // register a test user
        await request(app)
          .post(API_PREFIX + '/register')
          .send(`username=${user.username}`)
          .send(`password=${user.password}`)
          .send(`email=${user.email}`)
          .set('Accept', 'application/json')
  
        const res = await request(app)
          .post(API_PREFIX + '/login')
          .send(`username=${user.username}`)
          .send(`password=${user.password}`)
          .set('Accept', 'application/json')  

        accessToken = res.body.access_token
        refreshToken = res.body.refresh_token  
      } catch(err) {
        console.log(err)
      }
    })

    after(async () => {
      await User.deleteMany({ "username": /^user*/ })
      await Category.deleteMany({ "name": /^category*/  })

      await request(app)
        .get(API_PREFIX + '/logout')
        .set('Accept', 'application/json')
    })
    
    it('should receive ForbiddenError if user is logged in with insufficient privilege level', async () => {
      const res = await request(app)
        .post(API_PREFIX + '/category')
        .set('Cookie', [`accessToken=${accessToken};refreshToken=${refreshToken};loginHash=${loginHash}`])
        .send({ name: categoryName1 })
        .set('Accept', 'application/json')
        .expect(403)

      expect(res.body).to.have.property('err').to.eq('ForbiddenError')
      expect(res.body).to.have.property('errmsg').to.eq('User is not admin')
    })
  })

  context('User not logged in', () => {
    it('should receive ForbiddenError if user is logged in with insufficient privilege level', async () => {
      const res = await request(app)
        .post(API_PREFIX + '/category')
        .send({ name: categoryName1 })
        .set('Accept', 'application/json')
        .expect(403)

      expect(res.body).to.have.property('err').to.eq('ForbiddenError')
      expect(res.body).to.have.property('errmsg').to.eq('Forbidden access')
    })
  })

})