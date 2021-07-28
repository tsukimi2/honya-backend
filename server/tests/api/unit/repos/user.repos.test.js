import sinon from 'sinon'
import chai from 'chai'
const expect = chai.expect
import sinonChai from 'sinon-chai'
import _ from 'lodash'
import UserRepos from '../../../../src/user/user.repos.js'
import { generateUserParams } from '../../../factories/userFactory.js'
import DatabaseError from '../../../../src/errors/DatabaseError.js'
import NotFoundError from '../../../../src/errors/NotFoundError.js'
import ApplicationError from '../../../../src/errors/ApplicationError.js'

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
    deleteOne: (filterParams) => {},
  }

  afterEach(() => {
    sandbox.restore()
  })

  context('get user', () => {
    context('getUserById()', () => {
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
        const resultUser = await userRepos.getUserById(dummyid, { lean: true })

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
          resultUser = await userRepos.getUserById(dummyid)
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
          resultUser = await userRepos.getUserById(dummyid)
        } catch(e) {
          err = e
        }

        expect(err).to.not.be.null
        expect(err).to.be.an.instanceof(ApplicationError)        
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

      it('should get user with valid user params', async () => {
        const filterParams = {
          username: expectedUser.username,
        }

        const userRepos = new UserRepos(model)
        const resultUser = await userRepos.getUser(filterParams, { lean: true })

        expect(resultUser).to.exist
        expect(resultUser).to.have.property('_id').to.equal(expectedUser._id)
        expect(resultUser).to.have.property('username').to.equal(expectedUser.username)
        expect(resultUser).to.have.property('hashedPassword').to.equal(expectedUser.hashedPassword)
        expect(resultUser).to.have.property('email').to.equal(expectedUser.email)
      })

      it('should throw ApplicationError with empty user params', async () => {
        const filterParams = {}

        let userRepos = null
        let resultUser = null
        let err = null
        try {
          userRepos = new UserRepos(model)
          resultUser = await userRepos.getUser(filterParams)
        } catch(e) {
          err = e
        }

        expect(err).to.not.be.null
        expect(err).to.be.an.instanceof(ApplicationError)
      })

      it('should throw ApplicationError with null user params', async () => {
        const filterParams = null

        let userRepos = null
        let resultUser = null
        let err = null
        try {
          userRepos = new UserRepos(model)
          resultUser = await userRepos.getUser(filterParams)
        } catch(e) {
          err = e
        }

        expect(err).to.not.be.null
        expect(err).to.be.an.instanceof(ApplicationError)
      })
    })
  })

  context('create user', () => {
    let err = null
    let actualUser = null
    let model = null
    let createUserSpy = null

    beforeEach(() => {
      err = null
      actualUser = null
      model = sinon.stub()
      model.prototype.save = sinon.stub().resolves()
      createUserSpy = model.prototype.save
    })

    it('should create user successfully with valid params', async () => {
      const userParams = generateUserParams({
        userProfile: 'validUser1',
        hasHashedPassword: true,
      })

      try {
        const userRepos = new UserRepos(model)
        actualUser = await userRepos.createUser(userParams)
      } catch(e) {
        err = e
      }

      expect(createUserSpy.calledOnce).to.be.true
      expect(actualUser).to.have.property('username').to.eq(userParams.username)
      expect(actualUser).to.have.property('email').to.eq(userParams.email)
    })

    it('should throw NotFoundError with empty params', async () => {
      const userParams = {}

      try {
        const userRepos = new UserRepos(model)
        actualUser = await userRepos.createUser(userParams)
      } catch(e) {
        err = e
      }

      expect(createUserSpy.notCalled).to.be.true
      expect(err).to.not.null
      expect(err).to.be.an.instanceOf(ApplicationError)
    })

    it('should throw NotFoundError with null params', async () => {
      const userParams = null

      try {
        const userRepos = new UserRepos(model)
        actualUser = await userRepos.createUser(userParams)
      } catch(e) {
        err = e
      }

      expect(createUserSpy.notCalled).to.be.true
      expect(err).to.not.null
      expect(err).to.be.an.instanceOf(ApplicationError)      
    })
  })

  context('update user', () => {

  })

  context('delete user', () => {
    it('should delete user successfully with valid filter params', async () => {
      let err = null
      const dummyid = 'dummyid'
      const filterParams = { _id: dummyid }
      const deleteUserSpy = sandbox.spy(model, 'deleteOne')

      try {
        const userRepos = new UserRepos(model)
        await userRepos.deleteUser(filterParams)
      } catch(e) {
        err = e
      }

      expect(deleteUserSpy.withArgs(filterParams).calledOnce).to.be.true
      expect(err).to.be.null
    })

    it('should throw NotFoundError with empty filter params', async () => {
      let err = null
      const filterParams = {}
      const deleteUserSpy = sandbox.spy(model, 'deleteOne')

      try {
        const userRepos = new UserRepos(model)
        await userRepos.deleteUser({})
      } catch(e) {
        err = e
      }

      expect(deleteUserSpy.called).to.be.false
      expect(err).to.not.be.null
      expect(err).to.be.an.instanceof(NotFoundError)
    })
  })
})