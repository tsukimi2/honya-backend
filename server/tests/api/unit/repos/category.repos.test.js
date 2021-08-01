import sinon from 'sinon'
import chai from 'chai'
const expect = chai.expect
import sinonChai from 'sinon-chai'
import ApplicationError from '../../../../src/errors/ApplicationError.js'
import CategoryRepos from '../../../../src/category/category.repos.js'

chai.use(sinonChai)

describe('Category repository', () => {
  context('Create category', () => {
    let categoryParams = null
    let err = null
    let model = null
    let createCategorySpy = null
    let actualCategory = null

    const sandbox = sinon.createSandbox()

    beforeEach(() => {
      actualCategory = null
      err = null
      categoryParams = {
        name: 'category1'
      }

      model = sandbox.stub()
      model.prototype.save = sandbox.stub().resolves()
      createCategorySpy = model.prototype.save
    })

    afterEach(() => {
      sandbox.restore()
    })

    it('should create category successfully with valid params', async() => {
      try {
        const categoryRepos = new CategoryRepos(model)
        actualCategory = await categoryRepos.createCategory(categoryParams)
      } catch(e) {
        err = e
      }

      expect(createCategorySpy.calledOnce).to.be.true
      expect(actualCategory).to.have.property('name').to.eq(categoryParams.name)
    })

    it('should throw ApplicationError with empty params', async() => {
      categoryParams = {}

      try {
        const categoryRepos = new CategoryRepos(model)
        actualCategory = await categoryRepos.createCategory(categoryParams)
      } catch(e) {
        err = e
      }

      expect(createCategorySpy.notCalled).to.be.true
      expect(err).to.not.null
      expect(err).to.be.an.instanceof(ApplicationError)
    })

    it('should throw ApplicationError with null params', async() => {
      categoryParams = null

      try {
        const categoryRepos = new CategoryRepos(model)
        actualCategory = await categoryRepos.createCategory(categoryParams)
      } catch(e) {
        err = e
      }

      expect(createCategorySpy.notCalled).to.be.true
      expect(err).to.not.null
      expect(err).to.be.an.instanceof(ApplicationError)   
    })
  }) 
})