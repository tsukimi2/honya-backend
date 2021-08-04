import sinon from 'sinon'
import chai from 'chai'
const expect = chai.expect
import sinonChai from 'sinon-chai'
import mongoose from 'mongoose'
import ProductRepos from '../../../../src/product/product.repos.js'
import ApplicationError from '../../../../src/errors/ApplicationError.js'
import DatabaseError from '../../../../src/errors/DatabaseError.js'
import { generateProductParams } from '../../../factories/productFactory.js'
import NotFoundError from '../../../../src/errors/NotFoundError.js'

chai.use(sinonChai)
const sandbox = sinon.createSandbox()

describe('Product repository', () => {
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
      populate: (params) => {
        return model
      },
      sort: (params) => {
        return model
      },
      limit: (param) => {
        return model
      }
    }
  })

  afterEach(() => {
    sandbox.restore()
  })

  context('Get product', () => {
    context('getById()', () => {
      it('should get product with valid product id', async () => {
        const dummyid = 'dummy1'
        const expected = generateProductParams({
          productProfile: 'basic',
          optParams: { _id: dummyid }
        })
        model['exec'] = () => {
          return expected
        }
        model['lean'] = () => {
          return expected
        }

        let actual = null
        try {
          const repos = new ProductRepos(model)
          actual = await repos.getById(dummyid, { lean: true })
        } catch(e) {
          err = e
        }

        expect(actual).to.be.not.null
        expect(actual).to.have.property('_id').to.eq(dummyid)
        expect(actual).to.have.property('name').to.eq(expected.name)
      })

      it('should throw ApplicationError with empty product id', async () => {
        const dummyid = ''
        const expected = generateProductParams({
          productProfile: 'basic',
          optParams: { _id: dummyid }
        })
        model['exec'] = () => {
          return expected
        }
        model['lean'] = () => {
          return expected
        }

        let actual = null
        try {
          const repos = new ProductRepos(model)
          actual = await repos.getById(dummyid, { lean: true })
        } catch(e) {
          err = e
        }

        expect(err).to.not.be.null
        expect(err).to.be.an.instanceof(ApplicationError)  
      })

      it('should throw ApplicationError with null product id', async () => {
        const dummyid = undefined
        const expected = generateProductParams({
          productProfile: 'basic',
          optParams: { _id: dummyid }
        })
        model['exec'] = () => {
          return expected
        }
        model['lean'] = () => {
          return expected
        }

        let actual = null
        try {
          const repos = new ProductRepos(model)
          actual = await repos.getById(dummyid, { lean: true })
        } catch(e) {
          err = e
        }

        expect(err).to.not.be.null
        expect(err).to.be.an.instanceof(ApplicationError)  
      })

      it('should throw DatabaseError when product find in db unsuccessful', async () => {
        const dummyid = 'dummyid'
        const expected = generateProductParams({
          productProfile: 'basic',
          optParams: { _id: dummyid }
        })
        model['exec'] = sandbox.stub().throws(new DatabaseError())
        model['lean'] = sandbox.stub().throws(new DatabaseError())

        let actual = null
        try {
          const repos = new ProductRepos(model)
          actual = await repos.getById(dummyid, { lean: true })
        } catch(e) {
          err = e
        }

        expect(err).to.not.be.null
        expect(err).to.be.an.instanceof(DatabaseError)  
      })
    })

    context('getOne()', () => {
      it('should get product with valid filter params', async () => {
        const dummyid = 'dummy1'
        const expected = generateProductParams({
          productProfile: 'basic',
          optParams: { _id: dummyid }
        })
        model['exec'] = () => {
          return expected
        }
        model['lean'] = () => {
          return expected
        }

        let actual = null
        try {
          const repos = new ProductRepos(model)
          actual = await repos.getOne(dummyid, { lean: true })
        } catch(e) {
          err = e
        }

        expect(actual).to.be.not.null
        expect(actual).to.have.property('_id').to.eq(dummyid)
        expect(actual).to.have.property('name').to.eq(expected.name)
      })

      it('should get product with empty filter params', async () => {
        const filterParams = {}
        const dummyid = 'dummy1'
        const expected = generateProductParams({
          productProfile: 'basic',
          optParams: { _id: dummyid }
        })
        model['exec'] = () => {
          return expected
        }
        model['lean'] = () => {
          return expected
        }
        let actual = null
        try {
          const repos = new ProductRepos(model)
          actual = await repos.getOne(filterParams, { lean: true })
        } catch(e) {
          err = e
        }

        expect(actual).to.be.not.null
        expect(actual).to.have.property('_id').to.eq(dummyid)
        expect(actual).to.have.property('name').to.eq(expected.name)
      })

      it('should throw DatabaseError when product find in db unsuccessful', async () => {
        const dummyid = 'dummyid'
        const expected = generateProductParams({
          productProfile: 'basic',
          optParams: { _id: dummyid }
        })
        model['exec'] = sandbox.stub().throws(new DatabaseError())
        model['lean'] = sandbox.stub().throws(new DatabaseError())

        let actual = null
        try {
          const repos = new ProductRepos(model)
          actual = await repos.getOne(dummyid, { lean: true })
        } catch(e) {
          err = e
        }

        expect(err).to.not.be.null
        expect(err).to.be.an.instanceof(DatabaseError)  
      })
    })

    context('get', () => {
      it('should get product with valid filter params and opts params', async () => {
        const dummyid = 'dummy1'
        const expected = generateProductParams({
          productProfile: 'basic',
          optParams: { _id: dummyid }
        })
        model['exec'] = () => {
          return [ expected ]
        }
        model['lean'] = () => {
          return [ expected ]
        }
        const filterParams = {}
        const opts = {
          selectParams: '-photo',
          populatePath: 'category',
          sortBy: 'name,sold',
          order: '1,1',
          limit: 1,
        }

        let actual = null
        try {
          const repos = new ProductRepos(model)
          actual = await repos.get(filterParams, opts)
        } catch(e) {
          err = e
        }

        expect(actual).to.be.an('array')
        expect(actual[0]).to.exist
        expect(actual[0]).to.have.property('_id').to.eq(dummyid)
        expect(actual[0]).to.have.property('name').to.eq(expected.name)
      })

      it('should throw DatabaseError when product find in db unsuccessful', async () => {
        const dummyid = 'dummy1'
        const expected = generateProductParams({
          productProfile: 'basic',
          optParams: { _id: dummyid }
        })
        model['exec'] = () => {
          throw new Error()
        }
        model['lean'] = () => {
          throw new Error()
        }
        const filterParams = {}
        const opts = {
          selectParams: '-photo',
          populatePath: 'category',
          sortBy: 'name,sold',
          order: '1,1',
          limit: 1,
        }

        let actual = null
        try {
          const repos = new ProductRepos(model)
          actual = await repos.get(filterParams, opts)
        } catch(e) {
          err = e
        }

        expect(err).to.not.be.null
        expect(err).to.be.an.instanceof(DatabaseError)  
      })
    })
  })

  context('Create product', () => {
    let docParams = null
    let model = null
    let createSpy = null
    let actualDoc = null

    beforeEach(() => {
      actualDoc = null
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

  context('Update product', () => {
    context('updatOne()', () => {
      let actualDoc = null

      beforeEach(() => {
        actualDoc = null
      })

      it('should create product successfully with valid filter and update params', async () => {
        model['exec'] = () => {
          return model
        }
        model['save'] = () => {}

        const dummyid = 'dummyid'
        const filterParams = { _id: dummyid }
        const updateParams = {
          _id: dummyid,
          name: 'prodcut1'
        }

        try {
          const repos = new ProductRepos(model)
          actualDoc = await repos.updateOne(filterParams, updateParams)
        } catch(e) {
          err = e
        }

        expect(actualDoc).to.not.null
        expect(actualDoc).to.have.property('_id').to.eq(updateParams._id)
        expect(actualDoc).to.have.property('name').to.eq(updateParams.name)
      })

      it('should throw ApplicationError with empty filter params', async () => {
        model['exec'] = () => {
          return model
        }
        model['save'] = () => {}

        const dummyid = 'dummyid'
        const filterParams = {}
        const updateParams = {
          _id: dummyid,
          name: 'prodcut1'
        }

        try {
          const repos = new ProductRepos(model)
          actualDoc = await repos.updateOne(filterParams, updateParams)
        } catch(e) {
          err = e
        }

        expect(err).to.not.null
        expect(err).to.be.an.instanceof(ApplicationError)
      })

      it('should throw ApplicationError with null filter params', async () => {
        model['exec'] = () => {
          return model
        }
        model['save'] = () => {}

        const dummyid = 'dummyid'
        const filterParams = null
        const updateParams = {
          _id: dummyid,
          name: 'prodcut1'
        }

        try {
          const repos = new ProductRepos(model)
          actualDoc = await repos.updateOne(filterParams, updateParams)
        } catch(e) {
          err = e
        }

        expect(err).to.not.null
        expect(err).to.be.an.instanceof(ApplicationError)
      })

      it('should throw NotFoundError when document to be updated is not found', async () => {
        model['exec'] = () => {
          return null
        }
        model['save'] = () => {}

        const dummyid = 'dummyid'
        const filterParams = { _id: dummyid }
        const updateParams = {
          _id: dummyid,
          name: 'prodcut1'
        }

        try {
          const repos = new ProductRepos(model)
          actualDoc = await repos.updateOne(filterParams, updateParams)
        } catch(e) {
          err = e
        }

        expect(err).to.not.null
        expect(err).to.be.an.instanceof(NotFoundError)
      })

      it('should throw DatabaseError when product save in db unsuccessful', async () => {
        model['exec'] = () => {
          return model
        }
        model['save'] = () => { throw new Error() }

        const dummyid = 'dummyid'
        const filterParams = { _id: dummyid }
        const updateParams = {
          _id: dummyid,
          name: 'prodcut1'
        }

        try {
          const repos = new ProductRepos(model)
          actualDoc = await repos.updateOne(filterParams, updateParams)
        } catch(e) {
          err = e
        }

        expect(err).to.not.null
        expect(err).to.be.an.instanceof(DatabaseError)
      })
    })
  })

  context('Delete product', () => {
    let actualResult = null

    beforeEach(() => {
      actualResult = null
    })

    it('should delete product successfully and return number of deleted items with valid product params', async () => {
      const filterParams = { _id: 'dummyid' }

      try {
        const repos = new ProductRepos(model)
        actualResult = await repos.deleteOne(filterParams)
      } catch(e) {
        err = e
      }

      expect(err).to.be.null
      expect(actualResult).to.be.not.null
    })

    it('should throw ApplicationError with empty product params', async () => {
      const filterParams = {}

      try {
        const repos = new ProductRepos(model)
        actualResult = await repos.deleteOne(filterParams)
      } catch(e) {
        err = e
      }

      expect(err).to.be.an.instanceof(ApplicationError)
    })

    it('should throw ApplicationError with null product params', async () => {
      const filterParams = null

      try {
        const repos = new ProductRepos(model)
        actualResult = await repos.deleteOne(filterParams)
      } catch(e) {
        err = e
      }

      expect(err).to.be.an.instanceof(ApplicationError)
    })

    it('should throw DatabaseError when db throws error', async () => {
      const filterParams = { _id: 'dummyid' }
      model['deleteOne'] = (filterParams) => { throw new Error() }

      try {
        const repos = new ProductRepos(model)
        actualResult = await repos.deleteOne(filterParams)
      } catch(e) {
        err = e
      }

      expect(err).to.be.an.instanceof(DatabaseError)
    })
  })

  context('createSortArray', () => {
    let actualResult = null

    beforeEach(() => {
      actualResult = null
    })

    it('should return sort array for mongoose sort query with valid sortBy and order params', async () => {
      /*
        expectedResult = [ [ 'name', 1 ], [ 'sold', -1 ] ]
      */
      const sortBy = 'name,sold'
      const order = '1,-1'

      try {
        const repos = new ProductRepos(model)
        actualResult = await repos.createSortArray(sortBy, order)
      } catch(e) {
        err = e
      }

      expect(actualResult).to.be.an('array')
      expect(actualResult.length).to.eq(2)
      expect(actualResult[0]).to.be.an('array')
      expect(actualResult[0].length).to.eq(2)
      expect(actualResult[0][0]).to.eq('name')
      expect(actualResult[0][1]).to.eq(1)
      expect(actualResult[1][0]).to.eq('sold')
      expect(actualResult[1][1]).to.eq(-1)
    })

    it('should return sort array for mongoose sort query with valid sortBy but no order params', async () => {
      const sortBy = 'name,sold'

      try {
        const repos = new ProductRepos(model)
        actualResult = await repos.createSortArray(sortBy)
      } catch(e) {
        err = e
      }

      expect(actualResult).to.be.an('array')
      expect(actualResult.length).to.eq(2)
      expect(actualResult[0]).to.be.an('array')
      expect(actualResult[0].length).to.eq(2)
      expect(actualResult[0][0]).to.eq('name')
      expect(actualResult[0][1]).to.eq(1)
      expect(actualResult[1][0]).to.eq('sold')
      expect(actualResult[1][1]).to.eq(1)
    })

    it('should return sort array for mongoose sort query with valid sortBy but order params of length less than sortBy param', async () => {
      const sortBy = 'name,sold'
      const order = '1'

      try {
        const repos = new ProductRepos(model)
        actualResult = await repos.createSortArray(sortBy, order)
      } catch(e) {
        err = e
      }

      expect(actualResult).to.be.an('array')
      expect(actualResult.length).to.eq(2)
      expect(actualResult[0]).to.be.an('array')
      expect(actualResult[0].length).to.eq(2)
      expect(actualResult[0][0]).to.eq('name')
      expect(actualResult[0][1]).to.eq(1)
      expect(actualResult[1][0]).to.eq('sold')
      expect(actualResult[1][1]).to.eq(1)
    })

    it('should return sort array for mongoose sort query with valid sortBy but order params of length greater than sortBy param', async () => {
      const sortBy = 'name,sold'
      const order = '1, -1, 1'

      try {
        const repos = new ProductRepos(model)
        actualResult = await repos.createSortArray(sortBy, order)
      } catch(e) {
        err = e
      }

      expect(actualResult).to.be.an('array')
      expect(actualResult.length).to.eq(2)
      expect(actualResult[0]).to.be.an('array')
      expect(actualResult[0].length).to.eq(2)
      expect(actualResult[0][0]).to.eq('name')
      expect(actualResult[0][1]).to.eq(1)
      expect(actualResult[1][0]).to.eq('sold')
      expect(actualResult[1][1]).to.eq(-1)
    })

    it('should return empty sort array for mongoose sort query with no sortBy', async () => {
      const sortBy = ''

      try {
        const repos = new ProductRepos(model)
        actualResult = await repos.createSortArray(sortBy)
      } catch(e) {
        err = e
      }

      expect(actualResult).to.be.an('array')
      expect(actualResult.length).to.eq(0)
    })
  })
})