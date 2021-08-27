import { expect } from 'chai'
import { step } from 'mocha-steps'
import Page from '../../libs/builder.js'
import LoginPage from '../../libs/LoginPage.js'
import config from '../../../src/libs/config/index.js'
import { connectToMongodb } from '../../libs/mongodb.js'
import { generateUserParams } from '../../factories/userFactory.js'


describe('e2e category', () => {
  let page = null
  let loginPage = null
  //const loginUrl = 'http://honya.co.jp/signin'
  const loginUrl = `${config.get('uri:test_base_href')}/signin`
  let userParams = null
  let adminParams = null

  let dbclient = null
  let db = null
  let usersCollection = null

  before(async () => {
    dbclient = await connectToMongodb()
    db = dbclient.db('honya')
    usersCollection = db.collection('users')

    await usersCollection.deleteMany({ "username": /^user*/ })
    await usersCollection.deleteMany({ "username": /^admin*/ })

    userParams = await generateUserParams({ userProfile: 'validUser1', hasHashedPassword: true  })
    adminParams = await generateUserParams({ userProfile: 'validAdmin1', hasHashedPassword: true  })
  
    await usersCollection.insertOne(userParams)
    await usersCollection.insertOne(adminParams)

    page = await Page.build('Desktop')
    loginPage = await new LoginPage(page)
  })

  after(async () => {
    await page.close()
    await usersCollection.deleteMany({ "username": /^user*/ })
    await usersCollection.deleteMany({ "username": /^admin*/ })

    await dbclient.close()
  })

  describe('Able to access Category page with admin credentials', () => {
    before(async () => {
      await page.goto('loginUrl')
      await loginPage.login(adminParams.username, adminParams.passowrd)
    })

    after(async () => {

    })

    describe('e2e list categories', () => {
      context('should render category list when there are categories in db', () => {
    
      })
    
      context('should render empty list when no categories in db', () => {
        
      })
    })

    describe('e2e add category', () => {

    })

    describe('e2e edit category', () => {

    })

    describe('e2e delete category', () => {

    })
  })

  describe('Redirected to user dashboard when trying to access Category page with user-level credentials', () => {
    
  })

  describe('Redirected to sign-in page when trying to access Category page without logging in', () => {
    
  })
})
