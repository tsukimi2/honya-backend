import sinon from 'sinon'
import chai from 'chai'
const expect = chai.expect
import sinonChai from 'sinon-chai'
import _ from 'lodash'
import CategoryService from '../../../../src/category/category.service.js'
import ApplicationError from '../../../../src/errors/ApplicationError.js'

chai.use(sinonChai)

const sandbox = sinon.createSandbox()

describe('Category service', () => {
  const dummyid = 'dummyid'
  const categoryRepos = {
    createCategory: async (params) => {
      if(!params || _.isEmpty(params)) {
        throw new ApplicationError('Invalid user params')
      }

      return Object.assign({}, params, { _id: dummyid })
    }
  }
  const categoryService = CategoryService({ categoryRepos })
  let categoryParams = null
  let err = null

  beforeEach(() => {
    categoryParams = {
      name: 'category1'
    }
    err = null
  })

  context('Create category', () => {
    context('createCategory', () => {
      it('should create user successfully and return created user with valid params', async () => {
        let actualCategory = null

        try {
          actualCategory = await categoryService.createCategory(categoryParams)
        } catch(e) {
          err = e
        }

        expect(actualCategory).to.be.not.null
        expect(actualCategory).to.have.property('_id').to.eq(dummyid)
        expect(actualCategory).to.have.property('name').to.eq(categoryParams.name)
      })

      it('should throw ApplicationError with empty params', async () => {
        const categoryParams = {}

        try {
          await categoryService.createCategory(categoryParams)
        } catch(e) {
          err = e
        }

        expect(err).to.be.not.null
        expect(err).to.be.an.instanceof(ApplicationError)
      })

      it('should throw ApplicationError with null params', async () => {
        const categoryParams = null

        try {
          await categoryService.createCategory(categoryParams)
        } catch(e) {
          err = e
        }

        expect(err).to.be.not.null
        expect(err).to.be.an.instanceof(ApplicationError)
      })
    })
  })
})