import { expect } from 'chai'
import { step } from 'mocha-steps'
import Page from '../../libs/builder.js'
import config from '../../../src/libs/config/index.js'
import { generateUserParams } from '../../factories/userFactory.js'
import { connectToMongodb } from '../../libs/mongodb.js'

describe('e2e user logout', () => {
  let page = null
  const loginUrl = `${config.get('uri:test_base_href')}/signin`
  let userParams = null

  let dbclient = null
  let db = null
  let usersCollection = null

  before(async () => {
    userParams = await generateUserParams({ userProfile: 'validUser1', hasHashedPassword: true })

    dbclient = await connectToMongodb()
    db = dbclient.db('honya')
    usersCollection = db.collection('users')
    await usersCollection.deleteMany({ "username": /^user*/ })
    await usersCollection.insertOne(userParams)

    page = await Page.build('Desktop')
  })

  beforeEach(async () => {
    await page.goto(loginUrl)
    await page.waitAndType('#username', userParams.username)
    await page.type('#password', userParams.password)
    await page.click('button[type="submit"]')
    await page.waitForNavigation()
  })

  after(async () => {
    await page.close()
    await usersCollection.deleteMany({ "username": /^user*/ })
    await dbclient.close()
  })

  context('user logout and return to sign in page', () => {
    step('should login to application and see signout button on menu', async () => {
      const expectedSignoutBtnText = 'Sign Out'

      const actualSignoutBtnText = await page.getText('button[type="button"][class^="menu_signoutBtn"]')
      expect(actualSignoutBtnText).to.eq(expectedSignoutBtnText)
    })

    step('should redirect to homepage after clicking signout button', async () => {
      const expectedPageTitle = 'Sign In'

      await page.waitAndClick('button[type="button"][class^="menu_signoutBtn"]')
      await page.waitForResponse(response => {
        return response.status() === 200
      })

      const actualPageTitle = await page.getText('div[class^="main-header"] > h2')
      expect(actualPageTitle).to.eq(expectedPageTitle)
    })
  })
})