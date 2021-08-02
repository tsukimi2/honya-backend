import sinon from 'sinon'
import chai from 'chai'
const expect = chai.expect
import sinonChai from 'sinon-chai'
import mongoose from 'mongoose'
import ProductRepos from '../../../../src/product/product.repos.js'
import ApplicationError from '../../../../src/errors/ApplicationError.js'
import DatabaseError from '../../../../src/errors/DatabaseError.js'


chai.use(sinonChai)

describe('Product repository', () => {
  context('Create product', () => {
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
        name: 'product1',
        description: 'dummydesc',
        price: 65.00,
        category: mongoose.Types.ObjectId(),

      }

      model = sandbox.stub()
      model.prototype.save = sandbox.stub().resolves()
      createSpy = model.prototype.save
    })

    afterEach(() => {
      sandbox.restore()
    })

    it('should create product successfully with valid params', async () => {
      try {
        const repos = new ProductRepos(model)
        actualDoc = await repos.create(docParams)
      } catch(e) {
        err = e
      }

      expect(createSpy).to.be.calledOnce
      expect(actualDoc).to.have.property('name').to.eq(docParams.name)
    })

    it('should throw ApplicationError with empty params', async () => {
      docParams = {}

      try {
        const repos = new ProductRepos(model)
        actualDoc = await repos.create(docParams)
      } catch(e) {
        err = e
      }

      expect(createSpy).to.be.not.called
      expect(err).to.not.null
      expect(err).to.be.an.instanceof(ApplicationError)
    })

    it('should throw ApplicationError with null params', async () => {
      docParams = null

      try {
        const repos = new ProductRepos(model)
        actualDoc = await repos.create(docParams)
      } catch(e) {
        err = e
      }

      expect(createSpy).to.be.not.called
      expect(err).to.not.null
      expect(err).to.be.an.instanceof(ApplicationError)
    })

    it('should throw DatabaseError when product save in db unsuccessful', async () => {
      model.prototype.save = sandbox.stub().rejects()
      createSpy = model.prototype.save

      try {
        const repos = new ProductRepos(model)
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