import { expect } from 'chai'
import request from 'supertest'
import app from '../../../../src/app.js'
import config from '../../../../src/libs/config/index.js'
import User from '../../../../src/user/user.model.js'
import Category from '../../../../src/category/category.model.js'
import { generateUserParams } from '../../../factories/userFactory.js'
import { generateCategory } from '../../../factories/categoryFactory.js'

const API_PREFIX = config.get('app:api_prefix')

describe('Update category', () => {
  let res = null

  describe(API_PREFIX + '/categories/:id', () => {
    const updatedCategoryName = 'category1update'
    let storedCategory = null

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
        res = null
        
        try {
          await Category.deleteMany({ "name": /^category*/ })
          storedCategory = await generateCategory({})
        } catch(e) {
          console.log(e)
        }
      })

      afterEach(async () => {
        try {
          await Category.deleteMany({ "name": /^category*/ })
        } catch(e) {
          console.log(e)
        }
      })

      it('should update category successfully with valid category id and params', async () => {
        const categoryId = storedCategory._id.toString()

        try {
          res = await request(app)
            .put(`${API_PREFIX}/categories/${categoryId}`)
            .set('Cookie', [`accessToken=${accessToken};refreshToken=${refreshToken};loginHash=${loginHash}`])
            .send({ name: updatedCategoryName })
            .set('Accept', 'application/json')
            .expect(200)
        } catch(e) {
          console.log(e)
        }

        expect(res.body.data).to.exist
        expect(res.body.data.category).to.exist
        expect(res.body.data.category).to.have.property('_id').to.eq(categoryId)
        expect(res.body.data.category).to.have.property('name').to.eq(updatedCategoryName)
      })

      it('should receive BadRequestError with empty category name', async () => {
        const categoryId = storedCategory._id.toString()
        const categoryName = ''

        try {
          res = await request(app)
            .put(`${API_PREFIX}/categories/${categoryId}`)
            .set('Cookie', [`accessToken=${accessToken};refreshToken=${refreshToken};loginHash=${loginHash}`])
            .send({ name: categoryName })
            .set('Accept', 'application/json')
            .expect(400)
        } catch(e) {
          console.log(e)
        }

        expect(res.body).to.have.property('err').to.eq('BadRequestError')
        expect(res.body).to.have.property('errmsg').to.eq('Category name must have length between 1 and 50')
      })

      it('should receive BadRequestError with category name greater than length 30', async () => {
        const categoryId = storedCategory._id.toString()
        const categoryName = '12345677890123456778901234567789012345677890123456778901'

        try {
          res = await request(app)
            .put(`${API_PREFIX}/categories/${categoryId}`)
            .set('Cookie', [`accessToken=${accessToken};refreshToken=${refreshToken};loginHash=${loginHash}`])
            .send({ name: categoryName })
            .set('Accept', 'application/json')
            .expect(400)
        } catch(e) {
          console.log(e)
        }

        expect(res.body).to.have.property('err').to.eq('BadRequestError')
        expect(res.body).to.have.property('errmsg').to.eq('Category name must have length between 1 and 50')
      })
    })

    context('User logged in', () => {
      let user = null
      let accessToken = ''
      let refreshToken = ''
      const loginHash = 'userdummyhash'
      let storedCategory = null
      const dummyCategoryId = 'duumyid'
    
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
        try {
          res = await request(app)
            .put(`${API_PREFIX}/categories/${dummyCategoryId}`)
            .set('Cookie', [`accessToken=${accessToken};refreshToken=${refreshToken};loginHash=${loginHash}`])
            .send({ name: updatedCategoryName })
            .set('Accept', 'application/json')
            .expect(403)
        } catch(e) {
          console.log(e)
        }

        expect(res.body).to.have.property('err').to.eq('ForbiddenError')
        expect(res.body).to.have.property('errmsg').to.eq('User is not admin')
      })
    })

    context('User not logged in', () => {
      const dummyCategoryId = 'duumyid'

      it('should receive ForbiddenError if user is logged in with insufficient privilege level', async () => {
        try {
          res = await request(app)
            .put(`${API_PREFIX}/categories/${dummyCategoryId}`)
            .send({ name: updatedCategoryName })
            .set('Accept', 'application/json')
            .expect(403)
        } catch(e) {
          console.log(e)
        }

        expect(res.body).to.have.property('err').to.eq('ForbiddenError')
        expect(res.body).to.have.property('errmsg').to.eq('Forbidden access')
      })
    })
  })
})
