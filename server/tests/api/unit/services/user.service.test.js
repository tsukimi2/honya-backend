import sinon from 'sinon'
import chai from 'chai'
const expect = chai.expect
import sinonChai from 'sinon-chai'
import _ from 'lodash'
import UserService from '../../../../src/user/user.service.js'
import { generateUserParams } from '../../../factories/userFactory.js'
import CastError from '../../../../src/errors/CastError.js'

chai.use(sinonChai)

const sandbox = sinon.createSandbox()

describe('User service', () => {
  const dummyid = 'dummy1'
  const generatedUser = generateUserParams({
    userProfile: 'validUser1',
    hasHashedPassword: true,
    optParams: { _id: dummyid }
  })
  const userRepos = {
    getUserById: (id) => {
      if(!id) {
        throw new CastError('Cast to ObjectId failed for value')
      }
      return generatedUser
    },deleteUser: (filterParams) => {
      if(!filterParams || _.isEmpty(filterParams)) {
        throw new CastError('Cast to ObjectId failed for value')
      }
    }
  }

  afterEach(() => {
    sandbox.restore()
  })

  context('get user', () => {
    context('getUserById', (() => {
      it('should get user with valid user id', async () => {
        const expectedUser = generatedUser
        const userService = UserService({ userRepos })
        let resultUser = null
        let err = null
        try {
          resultUser = await userService.getUserById(dummyid)
        } catch(e) {
          err = e
        }
        
        expect(resultUser).to.not.be.null
        expect(resultUser).to.have.property('_id').to.equal(expectedUser._id)
        expect(resultUser).to.have.property('username').to.equal(expectedUser.username)
        expect(resultUser).to.have.property('hashedPassword').to.equal(expectedUser.hashedPassword)
        expect(resultUser).to.have.property('email').to.equal(expectedUser.email)
      })

      it('should throw NotFoundError with empty user id', async () => {
        const dummyid = ''
        const expectedUser = generatedUser
        const userService = UserService({ userRepos })
        let resultUser = null
        let err = null
        try {
          resultUser = await userService.getUserById(dummyid)
        } catch(e) {
          err = e
        }
        
        expect(err).to.be.not.null
        expect(err).to.be.an.instanceof(CastError)
      })
    }))
  })

  context('delete user', () => {
    let deleteUserSpy = null
    let userService = null

    beforeEach(() => {
      deleteUserSpy = sandbox.spy(userRepos, 'deleteUser')
      userService = UserService({ userRepos })
    })

    it('should call delete user successfully with valid filter params', async () => {
      const dummyid = 'dummyid'
      const filterParams = { _id: dummyid }
      let err = null

      try {
        await userService.deleteUser(filterParams)
      } catch(e) {
        err = e
      }

      expect(deleteUserSpy.withArgs(filterParams).calledOnce).to.be.true
    })

    it('should throw NotFoundError with empty filter params', async () => {
      const filterParams = {}
      let err = null

      try {
        await userService.deleteUser(filterParams)
      } catch(e) {
        err = e
      } 

      expect(err).to.be.not.null
      expect(err).to.be.an.instanceof(CastError)
    })

    it('should throw NotFoundError with empty null params', async () => {
      const filterParams = null
      let err = null

      try {
        await userService.deleteUser(filterParams)
      } catch(e) {
        err = e
      } 

      expect(err).to.be.not.null
      expect(err).to.be.an.instanceof(CastError)      
    })
  })
})