import sinon from 'sinon'
import chai from 'chai'
const expect = chai.expect
import sinonChai from 'sinon-chai'
import CategoryRepos from '../../../../src/category/category.repos.js'
import ApplicationError from '../../../../src/errors/ApplicationError.js'
import DatabaseError from '../../../../src/errors/DatabaseError.js'

chai.use(sinonChai)

describe('Category repository', () => {
  context('Create category', () => {
    let docParams = null
    let err = null
    let model = null
    let createSpy = null
    let actualDoc = null

    const sandbox = sinon.createSandbox()

    beforeEach(() => {
      actualDoc = null
      err = null
      docParams = {
        name: 'category1'
      }

      model = sandbox.stub()
      model.prototype.save = sandbox.stub().resolves()
      createSpy = model.prototype.save
    })

    afterEach(() => {
      sandbox.restore()
    })

    it('should create category successfully with valid params', async() => {
      try {
        const categoryRepos = new CategoryRepos(model)
        actualDoc = await categoryRepos.create(docParams)
      } catch(e) {
        err = e
      }

      expect(createSpy.calledOnce).to.be.true
      expect(actualDoc).to.have.property('name').to.eq(docParams.name)
    })

    it('should throw ApplicationError with empty params', async() => {
      docParams = {}

      try {
        const categoryRepos = new CategoryRepos(model)
        actualDoc = await categoryRepos.create(docParams)
      } catch(e) {
        err = e
      }

      expect(createSpy.notCalled).to.be.true
      expect(err).to.not.null
      expect(err).to.be.an.instanceof(ApplicationError)
    })

    it('should throw ApplicationError with null params', async() => {
      docParams = null

      try {
        const categoryRepos = new CategoryRepos(model)
        actualDoc = await categoryRepos.create(docParams)
      } catch(e) {
        err = e
      }

      expect(createSpy.notCalled).to.be.true
      expect(err).to.not.null
      expect(err).to.be.an.instanceof(ApplicationError)   
    })

    it('should throw DatabaseError when category save in db unsuccessful', async () => {
      model.prototype.save = sandbox.stub().rejects()
      createSpy = model.prototype.save

      try {
        const repos = new CategoryRepos(model)
        actualDoc = await repos.create(docParams)
      } catch(e) {
        err = e
      }

      expect(createSpy).to.be.calledOnce
      expect(err).to.exist
      expect(err).to.be.an.instanceof(DatabaseError)
    })
  }) 
})
