import sinon from 'sinon'
import chai from 'chai'
import sinonChai from 'sinon-chai'
import { mockRequest, mockResponse } from 'mock-req-res'
import { authController } from '../../../../src/di-container.js'
import ForbiddenError from '../../../../src/errors/ForbiddenError.js'
import { ROLE } from '../../../../src/user/user.constants.js'

chai.use(sinonChai)
const expect = chai.expect
const sandbox = sinon.createSandbox()

describe('auth middlewares', () => {
  const dummyid = 'dummyid'
  let nextSpy = null
  let res = null

  beforeEach(() => {
    nextSpy = sandbox.spy()
    res = mockResponse()
  })

  afterEach(() => {
    sandbox.restore()
  })

  context('isAuth', () => {
    it('should authorize if the resource being accessed belongs to the logged-in user -- i.e. if req.auth._id equals req.user._id ', () => {
      const reqOptions = {
        user: {
          _id: dummyid
        },
        auth: {
          _id: dummyid
        }
      }
      const req = mockRequest(reqOptions)

      authController.isAuth(req, res, nextSpy)

      expect(nextSpy).to.be.calledOnce
      expect(nextSpy).to.be.calledWith()
    })

    it('should throw ForbiddenError if the resource being accessed does not belong to the logged-in user', () => {
      const dummy2id = 'dummy2id'
      const reqOptions = {
        user: {
          _id: dummyid
        },
        auth: {
          _id: dummy2id
        }
      }
      const req = mockRequest(reqOptions)

      authController.isAuth(req, res, nextSpy)

      expect(nextSpy).to.be.calledOnce
      expect(nextSpy.args[0]).to.exist
      expect(nextSpy.args[0][0]).to.be.an.instanceof(ForbiddenError)
    })

    it('should throw ForbiddenErrorif user info from access token is missing', () => {
      const reqOptions = {
        user: {
          _id: dummyid
        },
      }
      const req = mockRequest(reqOptions)

      authController.isAuth(req, res, nextSpy)

      expect(nextSpy).to.be.calledOnce
      expect(nextSpy.args[0]).to.exist
      expect(nextSpy.args[0][0]).to.be.an.instanceof(ForbiddenError)
    })

    it('should throw ForbiddenError if user info from resource uri is missing', () => {
      const reqOptions = {
        auth: {
          _id: dummyid
        }
      }
      const req = mockRequest(reqOptions)

      authController.isAuth(req, res, nextSpy)

      expect(nextSpy).to.be.calledOnce
      expect(nextSpy.args[0]).to.exist
      expect(nextSpy.args[0][0]).to.be.an.instanceof(ForbiddenError)
    })
  })

  context('isAdmin', () => {
    it('should authorize when user is admin', () => {
      const reqOptions = {
        auth: {
          role: ROLE.ADMIN
        }
      }
      const req = mockRequest(reqOptions)

      authController.isAdmin(req, res, nextSpy)

      expect(nextSpy).to.be.calledOnce
      expect(nextSpy.args[0][0]).to.not.exist
    })

    it('should throw ForbiddenError when user is not admin', () => {
      const reqOptions = {
        auth: {
          role: ROLE.USER
        }
      }
      const req = mockRequest(reqOptions)

      authController.isAdmin(req, res, nextSpy)

      expect(nextSpy).to.be.calledOnce
      expect(nextSpy.args[0]).to.exist
      expect(nextSpy.args[0][0]).to.be.an.instanceof(ForbiddenError)
    })

    it('should throw ForbiddenErrorif user info from access token is missing', () => {
      const req = mockRequest()

      authController.isAdmin(req, res, nextSpy)

      expect(nextSpy).to.be.calledOnce
      expect(nextSpy.args[0]).to.exist
      expect(nextSpy.args[0][0]).to.be.an.instanceof(ForbiddenError)      
    })
  })
})