import sinon from 'sinon'
import chai from 'chai'
const expect = chai.expect
import sinonChai from 'sinon-chai'
import _ from 'lodash'
import UserRepos from '../../../../src/user/user.repos.js'
import { generateUserParams } from '../../../factories/userFactory.js'
import NotFoundError from '../../../../src/errors/NotFoundError.js'
import ApplicationError from '../../../../src/errors/ApplicationError.js'
import DatabaseError from '../../../../src/errors/DatabaseError.js'

chai.use(sinonChai)

/*
user
{
  _id: objectid,
  history: [],
  lastLoginAt: 1970-01-01T00:00:00.000Z,
  refreshToken: null,
  refreshTokenExpiresDt: null,
  username: 'user',
  hashedPassword: '$2b$10$wI84KHdupFEEwaHDW7bj3ufVGfx9Cr4dCmG8E6Dzr171VafhdSiV.',
  email: 'user@gmail.com',
  __v: 0,
  loginHash: null
}
*/

const sandbox = sinon.createSandbox()

describe('User repository', () => {
  let model = {
    findById: (id) => {
      return model
    },
    findOne: (filterParams) => {
      return model
    },
    // deleteOne: (filterParams) => {},
    select: (filterParams) => {
      return model
    }
  }

  beforeEach(() => {
    model['deleteOne'] = (filterParams) => {}
  })

  afterEach(() => {
    sandbox.restore()
  })

  context('get user', () => {
    context('getById()', () => {
      let expectedUser = null

      it('should get user with valid user id', async () => {
        const dummyid = 'dummy1'
        const expectedUser = generateUserParams({
          userProfile: 'validUser1',
          hasHashedPassword: true,
          optParams: { _id: dummyid }
        })
        model['exec'] = () => {
          return expectedUser
        }
        model['lean'] = () => {
          return expectedUser
        }

        const userRepos = new UserRepos(model)
        const resultUser = await userRepos.getById(dummyid, { lean: true })

        expect(resultUser).to.exist
        expect(resultUser).to.have.property('_id').to.equal(expectedUser._id)
        expect(resultUser).to.have.property('username').to.equal(expectedUser.username)
        expect(resultUser).to.have.property('hashedPassword').to.equal(expectedUser.hashedPassword)
        expect(resultUser).to.have.property('email').to.equal(expectedUser.email)
      })

      it('should throw ApplicationError with empty user id', async () => {
        const dummyid = ''
        const expectedUser = generateUserParams({
          userProfile: 'validUser1',
          hasHashedPassword: true,
          optParams: { _id: dummyid }
        })
        model['exec'] = () => {
          return expectedUser
        }
        model['lean'] = () => {
          return expectedUser
        }

        let userRepos = null
        let resultUser = null
        let err = null
        try {
          userRepos = new UserRepos(model)
          resultUser = await userRepos.getById(dummyid)
        } catch(e) {
          err = e
        }

        expect(err).to.not.be.null
        expect(err).to.be.an.instanceof(ApplicationError)
      })

      it('should throw ApplicationError with empty user id', async () => {
        const dummyid = null
        const expectedUser = generateUserParams({
          userProfile: 'validUser1',
          hasHashedPassword: true,
          optParams: { _id: dummyid }
        })
        model['exec'] = () => {
          return expectedUser
        }
        model['lean'] = () => {
          return expectedUser
        }

        let userRepos = null
        let resultUser = null
        let err = null
        
        try {
          userRepos = new UserRepos(model)
          resultUser = await userRepos.getById(dummyid)
        } catch(e) {
          err = e
        }

        expect(err).to.not.be.null
        expect(err).to.be.an.instanceof(ApplicationError)        
      })

      it('should throw DatabaseError when user find in db unsuccessful', async () => {
        const dummyid = 'dummyid'
        model['exec'] = sandbox.stub().throws(new DatabaseError())
        model['lean'] = sandbox.stub().throws(new DatabaseError())

        let userRepos = null
        let resultUser = null
        let err = null
        try {
          userRepos = new UserRepos(model)
          resultUser = await userRepos.getById(dummyid)
        } catch(e) {
          err = e
        }

        expect(err).to.not.be.null
        expect(err).to.be.an.instanceof(DatabaseError)
      })
    })

    context('get user', () => {
      const dummyid = 'dummyid'
      let expectedUser = null

      beforeEach(() => {
        expectedUser = generateUserParams({
          userProfile: 'validUser1',
          hasHashedPassword: true,
          optParams: { _id: dummyid }
        })

        model['exec'] = () => {
          return expectedUser
        }
        model['lean'] = () => {
          return expectedUser
        }
      })

      it('should get user successfully with valid user params', async () => {
        const filterParams = {
          username: expectedUser.username,
        }

        const userRepos = new UserRepos(model)
        const resultUser = await userRepos.getOne(filterParams, { lean: true })

        expect(resultUser).to.exist
        expect(resultUser).to.have.property('_id').to.equal(expectedUser._id)
        expect(resultUser).to.have.property('username').to.equal(expectedUser.username)
        expect(resultUser).to.have.property('hashedPassword').to.equal(expectedUser.hashedPassword)
        expect(resultUser).to.have.property('email').to.equal(expectedUser.email)
      })

      it('should get user successfully with empty user params', async () => {
        const filterParams = {}

        const userRepos = new UserRepos(model)
        const resultUser = await userRepos.getOne(filterParams, { lean: true })

        expect(resultUser).to.exist
        expect(resultUser).to.have.property('_id').to.equal(expectedUser._id)
        expect(resultUser).to.have.property('username').to.equal(expectedUser.username)
        expect(resultUser).to.have.property('hashedPassword').to.equal(expectedUser.hashedPassword)
        expect(resultUser).to.have.property('email').to.equal(expectedUser.email)
      })

      it('should get user successfully with null user params', async () => {
        const filterParams = null

        const userRepos = new UserRepos(model)
        const resultUser = await userRepos.getOne(filterParams, { lean: true })

        expect(resultUser).to.exist
        expect(resultUser).to.have.property('_id').to.equal(expectedUser._id)
        expect(resultUser).to.have.property('username').to.equal(expectedUser.username)
        expect(resultUser).to.have.property('hashedPassword').to.equal(expectedUser.hashedPassword)
        expect(resultUser).to.have.property('email').to.equal(expectedUser.email)
      })

      it('should throw DatabaseError when user find in db unsuccessful', async () => {
        const filterParams = {
          username: expectedUser.username,
        }
        model['exec'] = sandbox.stub().throws(new DatabaseError())
        model['lean'] = sandbox.stub().throws(new DatabaseError())

        let userRepos = null
        let resultUser = null
        let err = null
        try {
          userRepos = new UserRepos(model)
          resultUser = await userRepos.getOne(filterParams)
        } catch(e) {
          err = e
        }

        expect(err).to.not.be.null
        expect(err).to.be.an.instanceof(DatabaseError)
      })
    })
  })

  context('create user', () => {
    let err = null
    let actualDoc = null
    let model = null
    let createSpy = null

    beforeEach(() => {
      err = null
      actualDoc = null
      model = sinon.stub()
      model.prototype.save = sinon.stub().resolves()
      createSpy = model.prototype.save
    })

    it('should create user successfully with valid params', async () => {
      const docParams = generateUserParams({
        userProfile: 'validUser1',
        hasHashedPassword: true,
      })

      try {
        const userRepos = new UserRepos(model)
        actualDoc = await userRepos.create(docParams)
      } catch(e) {
        err = e
      }

      expect(createSpy.calledOnce).to.be.true
      expect(actualDoc).to.have.property('username').to.eq(docParams.username)
      expect(actualDoc).to.have.property('email').to.eq(docParams.email)
    })

    it('should throw ApplicationError with empty params', async () => {
      const docParams = {}

      try {
        const userRepos = new UserRepos(model)
        actualDoc = await userRepos.create(docParams)
      } catch(e) {
        err = e
      }

      expect(createSpy.notCalled).to.be.true
      expect(err).to.not.null
      expect(err).to.be.an.instanceOf(ApplicationError)
    })

    it('should throw ApplicationError with null params', async () => {
      const docParams = null

      try {
        const userRepos = new UserRepos(model)
        actualDoc = await userRepos.create(docParams)
      } catch(e) {
        err = e
      }

      expect(createSpy).to.be.not.called
      expect(err).to.not.null
      expect(err).to.be.an.instanceOf(ApplicationError)      
    })

    it('should throw DatabaseError when user save to db unsuccessful', async () => {
      const docParams = generateUserParams({
        userProfile: 'validUser1',
        hasHashedPassword: true,
      })

      model.prototype.save = sandbox.stub().rejects()
      createSpy = model.prototype.save

      try {
        const repos = new UserRepos(model)
        actualDoc = await repos.create(docParams)
      } catch(e) {
        err = e
      }

      expect(createSpy).to.be.calledOnce
      expect(err).to.exist
      expect(err).to.be.an.instanceof(DatabaseError)
    })
  })

  context('update user', () => {
    context('updateLoginHashAndRefreshToken', () => {

    })
  })

  context('delete user', () => {
    it('should delete user successfully with valid filter params', async () => {
      let err = null
      const dummyid = 'dummyid'
      const filterParams = { _id: dummyid }
      const deleteUserSpy = sandbox.spy(model, 'deleteOne')

      try {
        const userRepos = new UserRepos(model)
        await userRepos.deleteOne(filterParams)
      } catch(e) {
        err = e
      }

      expect(deleteUserSpy.withArgs(filterParams).calledOnce).to.be.true
      expect(err).to.be.null
    })

    it('should throw ApplicationError with empty filter params', async () => {
      let err = null
      const filterParams = {}
      const deleteUserSpy = sandbox.spy(model, 'deleteOne')

      try {
        const userRepos = new UserRepos(model)
        await userRepos.deleteOne({})
      } catch(e) {
        err = e
      }

      expect(deleteUserSpy.called).to.be.false
      expect(err).to.not.be.null
      expect(err).to.be.an.instanceof(ApplicationError)
    })

    it('should throw DatabaseError when user delete from db unsuccessful', async () => {
      let err = null
      const dummyid = 'dummyid'
      const filterParams = { _id: dummyid }
      model['deleteOne'] = sandbox.stub().rejects()

      try {
        const userRepos = new UserRepos(model)
        await userRepos.deleteOne(filterParams)
      } catch(e) {
        err = e
      }

      expect(err).to.not.be.null
      expect(err).to.be.an.instanceof(DatabaseError)
    })
  })
})