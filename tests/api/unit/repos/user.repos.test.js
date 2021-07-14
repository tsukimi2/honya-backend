import chai from 'chai'
const expect = chai.expect
import _ from 'lodash'
import UserRepos from '../../../../src/user/user.repos.js'
import { generateUserParams } from '../../../factories/userFactory.js'
import DatabaseError from '../../../../src/errors/DatabaseError.js'
import NotFoundError from '../../../../src/errors/NotFoundError.js'

/*
user
{
  _id: 60ec07b97f9d2d1cded4b4b1,
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

describe('User repository', () => {
  let model = {
    findById: (id) => {
      if(!id) {
        throw new DatabaseError()
      }
      return model
    },deleteOne: (filterParams) => {
      if(!filterParams || _.isEmpty(filterParams)) {
        throw new NotFoundError('Empty filter params when deleting user')
      }
    }
  }

  context('get user', () => {
    context('getUserById()', () => {
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

      it('should throw DatabaseError with empty user id', async () => {
        const dummyid = ''
        const expectedUser = generateUserParams({
          userProfile: 'validUser1',
          hasHashedPassword: true,
          optParams: { _id: '' }
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
        expect(err).to.be.an.instanceof(DatabaseError)
      })
    })
  })

  context('update user', () => {

  })

  context('delete user', () => {
    it('should delete user successfully with valid filter params', async () => {
      let err = null
      const dummyid = 'dummyid'

      try {
        const userRepos = new UserRepos(model)
        await userRepos.deleteUser({ _id: dummyid })
      } catch(e) {
        err = e
      }

      expect(err).to.be.null
    })

    it('should throw NotFoundError with empty filter params', async () => {
      let err = null
      const dummyid = 'dummyid'

      try {
        const userRepos = new UserRepos(model)
        await userRepos.deleteUser({})
      } catch(e) {
        err = e
      }

      expect(err).to.not.be.null
      expect(err).to.be.an.instanceof(NotFoundError)
    })
  })
})