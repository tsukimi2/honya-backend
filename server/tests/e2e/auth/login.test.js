import { expect } from 'chai'
import { step } from 'mocha-steps'
import Page from '../../libs/builder.js'
import config from '../../../src/libs/config/index.js'
import { generateUserParams } from '../../factories/userFactory.js'
import { connectToMongodb } from '../../libs/mongodb.js'


describe('e2e login', () => {
  let page = null
  //const loginUrl = 'http://honya.co.jp/signin'
  const loginUrl = `${config.get('uri:test_base_href')}/signin`
  let user1params = null
  let admin1params = null

  let dbclient = null
  let db = null
  let usersCollection = null

  before(async () => {
    dbclient = await connectToMongodb()
    db = dbclient.db('honya')
    usersCollection = db.collection('users')

    await usersCollection.deleteMany({ "username": /^user*/ })
    await usersCollection.deleteMany({ "username": /^admin*/ })

    user1params = await generateUserParams({ userProfile: 'validUser1', hasHashedPassword: true  })
    admin1params = await generateUserParams({ userProfile: 'validAdmin1', hasHashedPassword: true  })
  
    await usersCollection.insertOne(user1params)
    await usersCollection.insertOne(admin1params)

    page = await Page.build('Desktop')
  })

  after(async () => {
    await page.close()
    await usersCollection.deleteMany({ "username": /^user*/ })
    await usersCollection.deleteMany({ "username": /^admin*/ })

    await dbclient.close()
  })

  context('logiin sucessful and change to admin dashboard page with valid amdin username and password', () => {
    step('should display login form', async () => {
      await page.goto(loginUrl)
      const hasSignInButton = await page.isElementVisible('button[type="submit"]')
      expect(hasSignInButton).to.be.true
    })

    step('should login to application and redirect to admin dashboard', async () => {
      const expectedText = 'Admin Dashboard'
      await page.waitAndType('#username', admin1params.username)
      await page.waitAndType('#password', admin1params.password)
      await page.waitAndClick('button[type="submit"]')

      await page.waitForNavigation()
      const actualText = await page.getText('h2')
      expect(actualText).to.eq(expectedText)
    })
  })

  context('logiin sucessful and change to user dashboard page with valid user username and password', () => {
    step('should display login form', async () => {
      await page.goto(loginUrl)
      const hasSignInButton = await page.isElementVisible('button[type="submit"]')
      expect(hasSignInButton).to.be.true
    })

    step('should login to application and redirect to admin dashboard', async () => {
      const expectedText = 'Dashboard'
      await page.waitAndType('#username', user1params.username)
      await page.type('#password', user1params.password)
      await page.click('button[type="submit"]')
      await page.waitForNavigation()
      const actualText = await page.getText('h2')
      expect(actualText).to.eq(expectedText)
    })
  })

  context('display alert message whne login with username/password not found in db', () => {
    step('should display login form', async () => {
      await page.goto(loginUrl)
      const hasSignInButton = await page.isElementVisible('button[type="submit"]')
      expect(hasSignInButton).to.be.true
    })

    step('should display alert message of Username/password not found', async () => {
      const expecteText = 'Invalid username/password'

      await page.waitAndType('#username', user1params.username)
      await page.type('#password', 'wrongpass')
      await page.click('button[type="submit"]')
      const actualText = await page.getText('div[role="alert"]')
      expect(actualText).to.eq(expecteText)

    })
  })

  context('display error message when login with username/password of invalid format', () => {
    step('should display login form', async () => {
      await page.goto(loginUrl)
      const hasSignInButton = await page.isElementVisible('button[type="submit"]')
      expect(hasSignInButton).to.be.true
    })

    step('should display error message with invalid username and password', async () => {
      const expectedUsernameErrmsg = 'Must be between 3 and 20 characters'
      const expectedPasswordErrmsg = 'Must be between 8 and 20 characters'
      const usernameInputSelector = '#username'
      const passwordInputSelector = '#password'

      await page.waitAndType(usernameInputSelector, 'ab')
      await page.blur(usernameInputSelector)
      const actualUsernameErrmsg = await page.getText('#username + div.FormikInput_error__m152h')
      expect(actualUsernameErrmsg).to.eq(expectedUsernameErrmsg)

      await page.type(passwordInputSelector, '1234567')
      await page.blur(passwordInputSelector)
      const actualPasswordErrmsg = await page.getText('#password + div.FormikInput_error__m152h')
      expect(actualPasswordErrmsg).to.eq(expectedPasswordErrmsg)
    })

    step('should disable submit button with invalid username and password', async () => {
      const isSubmitBtnDisbled = await page.isElementVisible('button[type="submit"][disabled]')
      expect(isSubmitBtnDisbled).to.be.true
    })
  })
})