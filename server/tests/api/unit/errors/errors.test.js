import { expect } from "chai"
import ApplicationError from "../../../../src/errors/ApplicationError.js"
import BadRequestError from "../../../../src/errors/BadRequestError.js"
import BaseError from "../../../../src/errors/BaseError.js"
import DatabaseError from "../../../../src/errors/DatabaseError.js"
import ForbiddenError from "../../../../src/errors/ForbiddenError.js"
import NotFoundError from "../../../../src/errors/NotFoundError.js"
import TokenNotFoundError from "../../../../src/errors/TokenNotFoundError.js"
import UnauthorizedError from "../../../../src/errors/UnauthorizedError.js"
import UnprocessableEntityError from "../../../../src/errors/UnprocessableEntityError.js"
import UserFacingError from "../../../../src/errors/UserFacingError.js"

describe('Error classes', () => {
  const dummymsg = 'dummymsg'
  const dummyOptParam = {
    key1: 'val1',
    key2: 'val2'
  }


  context('ApplicationError', () => {
    it('should be an instance of Error', () => {
      const err = new ApplicationError()
      expect(err).to.be.an.instanceof(Error)
    })

    it('should have properties in options param attached to error object', () => {
      const err = new ApplicationError(dummymsg, dummyOptParam)
      expect(err).to.be.an.instanceof(Error)
      expect(err).to.have.property('key1').to.eq(dummyOptParam.key1)
      expect(err).to.have.property('key2').to.eq(dummyOptParam.key2)
    })
  })

  context('BadRequestError', () => {
    it('should be an instance of UserFacingError with status code 400 and default name and message as BadRequestError', () => {
      const err = new BadRequestError()

      expect(err).to.be.an.instanceof(UserFacingError)
      expect(err).to.have.property('statusCode').to.eq(400)
      expect(err).to.have.property('name').to.eq('BadRequestError')
      expect(err).to.have.property('message').to.eq('BadRequestError')
    })

    it('should allow custom message', () => {
      const err = new BadRequestError(dummymsg)
  
      expect(err).to.be.an.instanceof(UserFacingError)
      expect(err).to.have.property('statusCode').to.eq(400)
      expect(err).to.have.property('name').to.eq('BadRequestError')
      expect(err).to.have.property('message').to.eq(dummymsg)
    })

    it('should have properties in options param attached to error object', () => {
      const err = new BadRequestError(dummymsg, dummyOptParam)
      expect(err).to.be.an.instanceof(UserFacingError)
      expect(err).to.have.property('key1').to.eq(dummyOptParam.key1)
      expect(err).to.have.property('key2').to.eq(dummyOptParam.key2)
    })
    
    it('should write errors in error message as a semicolor-separated sstring when param opts.err exists and is an array', () => {
      const arrErr = [ { msg: 'err1' }, { msg: 'err2' }, { msg: 'err3' } ]
      const expectedMsg = 'err1;err2;err3'
      const err = new BadRequestError(dummymsg, {
        err: arrErr
      })

      expect(err).to.be.an.instanceof(UserFacingError)
      expect(err).to.have.property('statusCode').to.eq(400)
      expect(err).to.have.property('name').to.eq('BadRequestError')
      expect(err).to.have.property('message').to.eq(expectedMsg)
    })
  })

  context('DatabaseError', () => {
    it('should be an instance of Error', () => {
      const err = new DatabaseError()
      expect(err).to.be.an.instanceof(BaseError)
    })

    it('should have properties in options param attached to error object', () => {
      const err = new DatabaseError(dummymsg, dummyOptParam)
      expect(err).to.be.an.instanceof(BaseError)
      expect(err).to.have.property('key1').to.eq(dummyOptParam.key1)
      expect(err).to.have.property('key2').to.eq(dummyOptParam.key2)
    })

    it('should have status code 400 and error message "Dupllicate key error" error object in options param is a Mongo dupliate key error', () => {
      const err = new DatabaseError(dummymsg, {
        err: {
          name: 'MongoError',
          message: 'E11000 dummy',
        }
      })
      expect(err).to.be.an.instanceof(Error)
      expect(err).to.have.property('statusCode').to.eq(400)
      expect(err).to.have.property('message').to.eq('Duplicate key error')
    })
  })

  context('ForbiddenError', () => {
    it('should be an instance of UserFacingError with status code 403 and default name and message as ForbiddenError', () => {
      const err = new ForbiddenError()

      expect(err).to.be.an.instanceof(UserFacingError)
      expect(err).to.have.property('statusCode').to.eq(403)
      expect(err).to.have.property('name').to.eq('ForbiddenError')
      expect(err).to.have.property('message').to.eq('ForbiddenError')
    })

    it('should allow custom message', () => {
      const err = new ForbiddenError(dummymsg)
  
      expect(err).to.be.an.instanceof(UserFacingError)
      expect(err).to.have.property('statusCode').to.eq(403)
      expect(err).to.have.property('name').to.eq('ForbiddenError')
      expect(err).to.have.property('message').to.eq(dummymsg)
    })

    it('should have properties in options param attached to error object', () => {
      const err = new ForbiddenError(dummymsg, dummyOptParam)
      expect(err).to.be.an.instanceof(UserFacingError)
      expect(err).to.have.property('key1').to.eq(dummyOptParam.key1)
      expect(err).to.have.property('key2').to.eq(dummyOptParam.key2)
    })
  })
  
  context('NotfoundError', () => {
    it('should be an instance of UserFacingError with status code 404 and default name and message as NotFoundError', () => {
      const err = new NotFoundError()

      expect(err).to.be.an.instanceof(UserFacingError)
      expect(err).to.have.property('statusCode').to.eq(404)
      expect(err).to.have.property('name').to.eq('NotFoundError')
      expect(err).to.have.property('message').to.eq('NotFoundError')
    })

    it('should allow custom message', () => {
      const err = new NotFoundError(dummymsg)
  
      expect(err).to.be.an.instanceof(UserFacingError)
      expect(err).to.have.property('statusCode').to.eq(404)
      expect(err).to.have.property('name').to.eq('NotFoundError')
      expect(err).to.have.property('message').to.eq(dummymsg)
    })

    it('should have properties in options param attached to error object', () => {
      const err = new NotFoundError(dummymsg, dummyOptParam)
      expect(err).to.be.an.instanceof(UserFacingError)
      expect(err).to.have.property('key1').to.eq(dummyOptParam.key1)
      expect(err).to.have.property('key2').to.eq(dummyOptParam.key2)
    })
  })

  context('TokenNotFoundError', () => {
    it('should be an instance of UserFacingError with status code 401 and default name and message as TokenNotFoundError', () => {
      const err = new TokenNotFoundError()

      expect(err).to.be.an.instanceof(UnauthorizedError)
      expect(err).to.have.property('statusCode').to.eq(401)
      expect(err).to.have.property('name').to.eq('TokenNotFoundError')
      expect(err).to.have.property('message').to.eq('TokenNotFoundError')
    })

    it('should allow custom message', () => {
      const err = new TokenNotFoundError(dummymsg)
  
      expect(err).to.be.an.instanceof(UnauthorizedError)
      expect(err).to.have.property('statusCode').to.eq(401)
      expect(err).to.have.property('name').to.eq('TokenNotFoundError')
      expect(err).to.have.property('message').to.eq(dummymsg)
    })

    it('should have properties in options param attached to error object', () => {
      const err = new TokenNotFoundError(dummymsg, dummyOptParam)
      expect(err).to.be.an.instanceof(UnauthorizedError)
      expect(err).to.have.property('key1').to.eq(dummyOptParam.key1)
      expect(err).to.have.property('key2').to.eq(dummyOptParam.key2)
    })
  })

  context('UnauthorizedError', () => {
    it('should be an instance of UserFacingError with status code 401 and default name and message as UnauthorizedError', () => {
      const err = new UnauthorizedError()

      expect(err).to.be.an.instanceof(UserFacingError)
      expect(err).to.have.property('statusCode').to.eq(401)
      expect(err).to.have.property('name').to.eq('UnauthorizedError')
      expect(err).to.have.property('message').to.eq('UnauthorizedError')
    })

    it('should allow custom message', () => {
      const err = new UnauthorizedError(dummymsg)
  
      expect(err).to.be.an.instanceof(UserFacingError)
      expect(err).to.have.property('statusCode').to.eq(401)
      expect(err).to.have.property('name').to.eq('UnauthorizedError')
      expect(err).to.have.property('message').to.eq(dummymsg)
    })

    it('should have properties in options param attached to error object', () => {
      const err = new UnauthorizedError(dummymsg, dummyOptParam)
      expect(err).to.be.an.instanceof(UserFacingError)
      expect(err).to.have.property('key1').to.eq(dummyOptParam.key1)
      expect(err).to.have.property('key2').to.eq(dummyOptParam.key2)
    })
  })

  context('UnprocessableEntityError', () => {
    it('should be an instance of UserFacingError with status code 422 and default name and message as UnprocessableEntityError', () => {
      const err = new UnprocessableEntityError()

      expect(err).to.be.an.instanceof(UserFacingError)
      expect(err).to.have.property('statusCode').to.eq(422)
      expect(err).to.have.property('name').to.eq('UnprocessableEntityError')
      expect(err).to.have.property('message').to.eq('UnprocessableEntityError')
    })

    it('should allow custom message', () => {
      const err = new UnprocessableEntityError(dummymsg)
  
      expect(err).to.be.an.instanceof(UserFacingError)
      expect(err).to.have.property('statusCode').to.eq(422)
      expect(err).to.have.property('name').to.eq('UnprocessableEntityError')
      expect(err).to.have.property('message').to.eq(dummymsg)
    })

    it('should have properties in options param attached to error object', () => {
      const err = new UnprocessableEntityError(dummymsg, dummyOptParam)
      expect(err).to.be.an.instanceof(UserFacingError)
      expect(err).to.have.property('key1').to.eq(dummyOptParam.key1)
      expect(err).to.have.property('key2').to.eq(dummyOptParam.key2)
    })
  })

  context('UserFacingError', () => {
    it('should be an instance of BaseError', () => {
      const err = new UserFacingError()
      expect(err).to.be.an.instanceof(BaseError)
    })

    it('should have properties in options param attached to error object', () => {
      const err = new UserFacingError(dummymsg, dummyOptParam)
      expect(err).to.be.an.instanceof(BaseError)
      expect(err).to.have.property('key1').to.eq(dummyOptParam.key1)
      expect(err).to.have.property('key2').to.eq(dummyOptParam.key2)
    })
  })
})