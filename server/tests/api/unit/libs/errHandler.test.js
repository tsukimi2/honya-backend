import chai from 'chai'
const expect = chai.expect
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
import ErrHandler from '../../../../src/libs/errHandler.js'
import NotFoundError from '../../../../src/errors/NotFoundError.js'

chai.use(sinonChai)

const sandbox = sinon.createSandbox()

describe('libs/errHandler', () => {
  let res, statusStub, jsonStub = null
  const logger = {
    error: () => {}
  }
  const req = {}
  const next = () => {}
  const errHandler = ErrHandler({ logger })

  beforeEach(() => {
    jsonStub = sandbox.stub().returns('done')
    statusStub = sandbox.stub().returns({
      json: jsonStub
    })
    res = {
      status: statusStub
    }
  })

  afterEach(() => {
    sandbox.restore()
  })

  it('should check error instance and replies with status code, error name, and error message corresponding to the Error instance if it is an instance of Error', () => {
    const expectedErrmsg = 'testing not found'
    const err = new NotFoundError(expectedErrmsg)
    const result = errHandler.process(err, req, res, next)

    expect(statusStub).to.have.been.calledWith(404)
    expect(jsonStub).to.have.been.calledWith({
      err: err.name,
      errmsg: expectedErrmsg
    })
  })

  it('should reply http status code 500 if not instance of Error', () => {
    const expectedErrmsg = 'testing not found'
    const err = expectedErrmsg
    const result = errHandler.process(err, req, res, next)

    expect(statusStub).to.have.been.calledWith(500)
    expect(jsonStub).to.have.been.calledWith({
      err: 'InternalServerErr',
      errmsg: 'Internal server error'
    })    
  })
})