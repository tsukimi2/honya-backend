import sinon from 'sinon'
import chai from 'chai'
import sinonChai from 'sinon-chai'
import { mockRequest, mockResponse } from 'mock-req-res'
import { userController } from '../../../../src/di-container.js'

chai.use(sinonChai)
const expect = chai.expect
const sandbox = sinon.createSandbox()

describe('user middlewares', () => {
  let nextSpy = null
  let res = null

  beforeEach(() => {
    nextSpy = sandbox.spy()
    res = mockResponse()
  })

  afterEach(() => {
    sandbox.restore()
  })

  context('attachUidParamToReq', () => {
    it('should have user id attached to req user object with valid uid', () => {
      const dummyid = 'dummyid'
      const req = mockRequest()

      userController.attachUidParamToReq(req, res, nextSpy, dummyid)

      expect(req.user).to.exist
      expect(req.user).to.have.property('_id').to.eq(dummyid)
      expect(nextSpy).to.have.been.calledOnce
    })

    it('should not have user object attached to req object with empty uid', () => {
      const dummyid = ''
      const req = mockRequest()

      userController.attachUidParamToReq(req, res, nextSpy, dummyid)

      expect(req.user).to.not.exist
      expect(nextSpy).to.have.been.calledOnce
    })

    it('should not have user object attached to req object with null uid', () => {
      const dummyid = null
      const req = mockRequest()

      userController.attachUidParamToReq(req, res, nextSpy, dummyid)

      expect(req.user).to.not.exist
      expect(nextSpy).to.have.been.calledOnce      
    })
  })
})