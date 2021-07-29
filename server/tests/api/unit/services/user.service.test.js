import sinon from 'sinon'
import chai from 'chai'
const expect = chai.expect
import sinonChai from 'sinon-chai'
import _ from 'lodash'
import UserService from '../../../../src/user/user.service.js'
import { generateUserParams } from '../../../factories/userFactory.js'
import ApplicationError from '../../../../src/errors/ApplicationError.js'

chai.use(sinonChai)

const sandbox = sinon.createSandbox()

describe('User service', () => {
  let err = null
  const dummyid = 'dummy1'
  const generatedUser = generateUserParams({
    userProfile: 'validUser1',
    hasHashedPassword: true,
    optParams: { _id: dummyid }
  })
  let actualUser = null
  let userRepos = null

  beforeEach(() => {
    actualUser = null
    err = null

    userRepos = {
      getUserById: (id) => {
        if(!id) {
          throw new ApplicationError('Invalid user id')
        }
        return generatedUser
      },
      getUser: (params) => {
        if(!params || _.isEmpty(params)) {
          throw new ApplicationError('Invalid user params')
        }
        return Object.assign({}, params, { _id: dummyid })
      },
      createUser: (params) => {
        if(!params || _.isEmpty(params)) {
          throw new ApplicationError()
        }
  
        return Object.assign({}, params, { _id: 'dummyid' })
      },
      deleteUser: (filterParams) => {
        if(!filterParams || _.isEmpty(filterParams)) {
          throw new ApplicationError('Empty filter params when deleting user')
        }
      }
    }
  })

  afterEach(() => {
    sandbox.restore()
  })

  context('get user', () => {
    context('getUserById', (() => {
      it('should get user with valid user id', async () => {
        const expectedUser = generatedUser
        const userService = UserService({ userRepos })

        try {
          actualUser = await userService.getUserById(dummyid)
        } catch(e) {
          err = e
        }
        
        expect(actualUser).to.not.be.null
        expect(actualUser).to.have.property('_id').to.equal(expectedUser._id)
        expect(actualUser).to.have.property('username').to.equal(expectedUser.username)
        expect(actualUser).to.have.property('hashedPassword').to.equal(expectedUser.hashedPassword)
        expect(actualUser).to.have.property('email').to.equal(expectedUser.email)
      })

      it('should throw ApplicationError with empty user id', async () => {
        const dummyid = ''
        const userService = UserService({ userRepos })
        let resultUser = null
        let err = null
        try {
          resultUser = await userService.getUserById(dummyid)
        } catch(e) {
          err = e
        }
        
        expect(err).to.be.not.null
        expect(err).to.be.an.instanceof(ApplicationError)
      })

      it('should throw ApplicationError with empty user id', async () => {
        const dummyid = null
        const userService = UserService({ userRepos })
        let resultUser = null
        let err = null
        try {
          resultUser = await userService.getUserById(dummyid)
        } catch(e) {
          err = e
        }
        
        expect(err).to.be.not.null
        expect(err).to.be.an.instanceof(ApplicationError)
      })
    }))

    context('getUser', (() => {
      it('should get user with valid user params', async () => {
        const expectedUser = generatedUser
        const userService = UserService({ userRepos })

        try {
          actualUser = await userService.getUser(generatedUser)
        } catch(e) {
          err = e
        }
        
        expect(actualUser).to.not.be.null
        expect(actualUser).to.have.property('_id').to.equal(expectedUser._id)
        expect(actualUser).to.have.property('username').to.equal(expectedUser.username)
        expect(actualUser).to.have.property('hashedPassword').to.equal(expectedUser.hashedPassword)
        expect(actualUser).to.have.property('email').to.equal(expectedUser.email)
      })

      it('should throw ApplicationError with empty user params', async () => {
        const userParams = {}
        const userService = UserService({ userRepos })
        let resultUser = null
        let err = null
        try {
          resultUser = await userService.getUser(userParams)
        } catch(e) {
          err = e
        }
        
        expect(err).to.be.not.null
        expect(err).to.be.an.instanceof(ApplicationError)
      })

      it('should throw ApplicationError with null user params', async () => {
        const userParams = null
        const userService = UserService({ userRepos })
        let resultUser = null
        let err = null
        try {
          resultUser = await userService.getUser(userParams)
        } catch(e) {
          err = e
        }
        
        expect(err).to.be.not.null
        expect(err).to.be.an.instanceof(ApplicationError)
      })
    }))    

    
  })

  context('create user', () => {
    context('getOneOrCreateByGoogleDetails', () => {
      let createUserSpy = null
      beforeEach(() => {
        createUserSpy = sandbox.spy(userRepos, 'createUser')
      })

      it('should throw ApplicationError with empty param googleAccountId', async () => {
        const googleAccountId = ''
        const googleAccountEmail = 'dummy@gmail.com'

        try {
          const userService = UserService({ userRepos })
          actualUser = await userService.getOneOrCreateByGoogleDetails(googleAccountId, googleAccountEmail)
        } catch(e) {
          err = e
        }

        expect(err).to.not.null
        expect(err).to.be.an.instanceof(ApplicationError)
        expect(createUserSpy.notCalled).to.be.true
      })

      it('should throw ApplicationError with empty param googleAccountEmail', async () => {
        const googleAccountId = 123456789

        try {
          const userService = UserService({ userRepos })
          actualUser = await userService.getOneOrCreateByGoogleDetails(googleAccountId)
        } catch(e) {
          err = e
        }

        expect(err).to.not.null
        expect(err).to.be.an.instanceof(ApplicationError)
        expect(createUserSpy.notCalled).to.be.true
      })

      it('should return user if user with provided googleAccountId already existed', async() => {
        const googleAccountId = 123456789
        const googleAccountEmail = 'dummy@gmail.com'

        try {
          const userService = UserService({ userRepos })
          actualUser = await userService.getOneOrCreateByGoogleDetails(googleAccountId, googleAccountEmail)
        } catch(e) {
          err = e
        }

        expect(createUserSpy.notCalled).to.be.true
        expect(actualUser).to.not.null
        expect(actualUser).to.have.property('googleAccountId').to.eq(googleAccountId)
      })

      it('should create new user if user with provided googleAccountId not existed yet', async () => {
        userRepos['getUser'] = (params) => {
          return []
        }
        
        const googleAccountId = 123456789
        const googleAccountEmail = 'dummy@gmail.com'

        try {
          const userService = UserService({ userRepos })
          actualUser = await userService.getOneOrCreateByGoogleDetails(googleAccountId, googleAccountEmail)
        } catch(e) {
          err = e
        }

        expect(createUserSpy.calledOnce).to.be.true
        expect(actualUser).to.not.null
        expect(actualUser).to.have.property('googleAccountId').to.eq(googleAccountId)
        expect(actualUser).to.have.property('googleAccountEmail').to.eq(googleAccountEmail)
      })
    })
  })

  context('update user', () => {

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

      try {
        await userService.deleteUser(filterParams)
      } catch(e) {
        err = e
      }

      expect(deleteUserSpy.withArgs(filterParams).calledOnce).to.be.true
    })

    it('should throw ApplicationError with empty filter params', async () => {
      const filterParams = {}
      let err = null

      try {
        await userService.deleteUser(filterParams)
      } catch(e) {
        err = e
      } 

      expect(err).to.be.not.null
      expect(err).to.be.an.instanceof(ApplicationError)
    })

    it('should throw ApplicationError with empty null params', async () => {
      const filterParams = null
      let err = null

      try {
        await userService.deleteUser(filterParams)
      } catch(e) {
        err = e
      } 

      expect(err).to.be.not.null
      expect(err).to.be.an.instanceof(ApplicationError)      
    })
  })
})