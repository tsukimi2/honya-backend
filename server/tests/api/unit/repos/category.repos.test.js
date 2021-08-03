import sinon from 'sinon'
import chai from 'chai'
const expect = chai.expect
import sinonChai from 'sinon-chai'
import CategoryRepos from '../../../../src/category/category.repos.js'
import ApplicationError from '../../../../src/errors/ApplicationError.js'
import DatabaseError from '../../../../src/errors/DatabaseError.js'

chai.use(sinonChai)

describe('Category repository', () => {
  let err = null
  let model = null

  beforeEach(() => {
    err = null
    model = {
      findById: (id) => {
        return model
      },
      findOne: (filterParams) => {
        return model
      },
      find: (filterParams) => {
        return model
      },
      deleteOne: (filterParams) => {
        return { n: 1, ok: 1, deletedCount: 1 }
      },
      select: (filterParams) => {
        return model
      },
      exec: () => {
        return null
      },
      lean: () => {
        return null
      }
    }
  })

  context('Get category', () => {
    context('get', () => {
      let expectedDocs = null
      let actualDocs = null
      let filterParams = null

      beforeEach(() => {
        expectedDocs = null
        actualDocs = null
        filterParams = null
      })

      it('should return categories when with valid filter params', async () => {
        filterParams = {}
        expectedDocs = []
        model['exec'] = () => { return expectedDocs }
        model['lean'] = () => { return expectedDocs }

        try {
          const repos = new CategoryRepos(model)
          actualDocs = await repos.get(filterParams)
        } catch(e) {
          err = e
        }

        expect(actualDocs).to.not.null
        expect(actualDocs).to.eq(expectedDocs)
      })

      it('should return null when there are no cateogories in db', async () => {
        filterParams = {}
        expectedDocs = null
        model['exec'] = () => { return expectedDocs }
        model['lean'] = () => { return expectedDocs }

        try {
          const repos = new CategoryRepos(model)
          actualDocs = await repos.get(filterParams)
        } catch(e) {
          err = e
        }

        expect(actualDocs).to.be.null
      })

      it('should throw DatabaseError when categories find encounters db error', async () => {
        filterParams = {}
        expectedDocs = null
        model['exec'] = () => { throw new Error() }
        model['lean'] = () => { throw new Error() }

        try {
          const repos = new CategoryRepos(model)
          actualDocs = await repos.get(filterParams)
        } catch(e) {
          err = e
        }

        expect(err).to.be.an.instanceof(DatabaseError)
        expect(err).to.have.property('message').to.eq('cannot find documents')
      })
    })
  })

  context('Create category', () => {
    let docParams = null
    let model = null
    let createSpy = null
    let actualDoc = null

    const sandbox = sinon.createSandbox()

    beforeEach(() => {
      actualDoc = null
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
