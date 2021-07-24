import util from 'util'
import chai from 'chai'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
chai.use(sinonChai)
import mongoose from 'mongoose'
import { generateUser, generateUserParams } from '../../../factories/userFactory.js'
import User from '../../../../src/user/user.model.js'
import DatabaseError from '../../../../src/errors/DatabaseError.js'

const expect = chai.expect
const sandbox = sinon.createSandbox()
let user = null

describe('User model', () => {
  beforeEach(() => {

  })

  afterEach(async () => {
    // sandbox.restore()

    try {
      await User.deleteMany({ "username": /^user*/ })
    } catch(err) {
      console.log(err)
    }
  })

  context('Testing model validations', async () => {
    let userParams = null

    beforeEach(() => {
      userParams = generateUserParams({ userProfile: 'validUser1' })
    })

    it('should be valid with valid username, password, and email', (done) => {
      const user = new User(userParams)
      user.validate((err) => {
        expect(err).to.not.exist
        done()
      })
    })

    context('Testng username', () => {
      it('should be invalid with empty username', (done) => {
        userParams.username = ''

        const user = new User(userParams)
        user.validate((err)=>{
          expect(err.errors.username).to.exist
          expect(err.errors.username.kind).to.eq('required')
          done()
        })
      })

      it('should be invalid with username shorter than length 3', (done) => {
        userParams.username = 'ab'

        const user = new User(userParams)
        user.validate((err)=>{
          expect(err.errors.username).to.exist
          expect(err.errors.username.kind).to.eq('minlength')
          done()
        })
      })
      
      it('should be invalid with username longer than length 20', (done) => {
        userParams.username = '123456789012345678901'

        const user = new User(userParams)
        user.validate((err)=>{
          expect(err.errors.username).to.exist
          expect(err.errors.username.kind).to.eq('maxlength')
          done()
        })
      })
    })

    context('Testing password', () => {
      it('should be invalid with empty password', (done) => {
        userParams.password = ''

        const user = new User(userParams)
        user.validate((err)=>{
          expect(err.errors.password).to.exist
          expect(err.errors.password.kind).to.eq('required')
          done()
        })
      })

      it('should be invalid with password less than length 8', (done) => {
        userParams.password = '1234567'

        const user = new User(userParams)
        user.validate((err)=>{
          expect(err.errors.password).to.exist
          expect(err.errors.password.kind).to.eq('minlength')
          done()
        })
      })

      it('should be invalid with password greater than length 20', (done) => {
        userParams.password = '123456789012345678901'

        const user = new User(userParams)
        user.validate((err)=>{
          expect(err.errors.password).to.exist
          expect(err.errors.password.kind).to.eq('maxlength')
          done()
        })
      })
    })
    context('Testing email', () => {
      it('should be invalid with empty email', (done) => {
        userParams.email = ''

        const user = new User(userParams)
        user.validate((err)=>{
          expect(err.errors.email).to.exist
          expect(err.errors.email.kind).to.eq('required')
          done()
        })
      })

      it('should be invalid with invalid email', (done) => {
        userParams.email = 'usergmail.com'

        const user = new User(userParams)
        user.validate((err)=>{
          expect(err.errors.email).to.exist
          expect(err.errors.email.kind).to.eq('invalidEmailFormat')
          done()
        })
      })
    })
  })

  context('Testing model instance methods', () => {

  })

  context('Testing static functions', () => {
    context('refresupdateLoginHashAndRefreshToken()', () => {
      afterEach(() => {
        sandbox.restore()
      })

      it('should call findOneAndUpdate() once with valid filterParams and updateParams', async () => {
        const userParams = generateUserParams({ userProfile: 'validUser1' })
        const filterParams = {
          _id: mongoose.Types.ObjectId('60ebfd75f5bd8614a45162b9'),
          username: userParams.username
        }
        const updateParams = {
          loginHash: 'dummyHash',
          refreshToken: 'dummyRefreshToken',
          refreshTokenExpiresDt: new Date()          
        }
        userParams.loginHash = updateParams.loginHash
        userParams.refreshToken = updateParams.refreshToken
        userParams.refreshTokenExpiresDt = updateParams.refreshTokenExpiresDt
        let sampleUser = new User(userParams)
        
        const findOneAndUpdateStub = sandbox.stub(User, 'findOneAndUpdate').resolves(sampleUser)
        
        let user = null
        try {
          user = await User.updateLoginHashAndRefreshToken(filterParams, updateParams)
        } catch(e) {

        }
        
        expect(findOneAndUpdateStub).to.have.been.calledOnce
        expect(findOneAndUpdateStub).to.have.been.calledWith(filterParams, updateParams)
        expect(user).to.have.property('loginHash').to.equal(updateParams.loginHash)
        expect(user).to.have.property('refreshToken').to.equal(updateParams.refreshToken)
        expect(user).to.have.property('refreshTokenExpiresDt').to.equal(updateParams.refreshTokenExpiresDt)
      })

      it('should call findOneAndUpdate() once with empty filterParams', async () => {
        const userParams = generateUserParams({ userProfile: 'validUser1' })
        const filterParams = {}
        const updateParams = {
          loginHash: 'dummyHash',
          refreshToken: 'dummyRefreshToken',
          refreshTokenExpiresDt: new Date()          
        }
        userParams.loginHash = updateParams.loginHash
        userParams.refreshToken = updateParams.refreshToken
        userParams.refreshTokenExpiresDt = updateParams.refreshTokenExpiresDt
        let sampleUser = new User(userParams)
        
        const findOneAndUpdateStub = sandbox.stub(User, 'findOneAndUpdate')

        let user = null
        let err = null
        try {
          user = await User.updateLoginHashAndRefreshToken(filterParams, updateParams)
        } catch(e) {
          err = e
        }

        expect(findOneAndUpdateStub).to.not.have.been.called
        expect(err).to.be.an.instanceof(DatabaseError)
      })
    })
    
  })
})


