import { expect } from 'chai'
import { step } from 'mocha-steps'
import Page from '../../libs/builder.js'
import config from '../../../src/libs/config/index.js'
import { generateUserParams } from '../../factories/userFactory.js'
import { connectToMongodb } from '../../libs/mongodb.js'

describe('e2e user register', () => {
  let page = null
  const signupUrl = `${config.get('uri:test_base_href')}/signup`
  let userParams = null
  let dbclient = null
  let db = null
  let usersCollection = null

  before(async () => {
    dbclient = await connectToMongodb()
    db = dbclient.db('honya')
    usersCollection = db.collection('users')
    await usersCollection.deleteMany({ "username": /^user*/ })

    userParams = await generateUserParams({ userProfile: 'validUser1', hasHashedPassword: true })

    page = await Page.build('Desktop')
  })

  beforeEach(async () => {
    await usersCollection.deleteMany({ "username": /^user*/ })
  })

  after(async () => {
    page.close()
    await usersCollection.deleteMany({ "username": /^user*/ })

    await dbclient.close()
  })

  context('register sucessful and success toast displayed', () => {
    step('should display register form', async () => {
      await page.goto(signupUrl)
      const hasSignupButton = await page.isElementVisible('button[type="submit"]')
      expect(hasSignupButton).to.be.true
    })

    step('should display success toast when registered successfully', async () => {
      const expectedText = 'User registration successful'

      await page.waitAndType('#username', userParams.username)
      await page.type('#password', userParams.password)
      await page.type('#email', userParams.email)
      await page.click('button[type="submit"]')

      await page.waitForResponse(response => {
        return response.status() === 201
      })

      const hasSuccessToast = await page.isElementVisible('#userRegSucessToastId')
      const actualText = await page.getText('#userRegSucessToastId > div[role="alert"]')

      expect(hasSuccessToast).to.be.true
      expect(actualText).to.eq(expectedText)
    })
  })

  context('display alert message when register with username/email already found in db', () => {
    step('should display register form', async () => {
      await page.goto(signupUrl)
      const hasSignupButton = await page.isElementVisible('button[type="submit"]')
      expect(hasSignupButton).to.be.true
    })

    step('should display alert message when username already found in db', async () => {
      const expectedText = 'Username or email already registered'

      await usersCollection.insertOne(userParams)
      await page.waitAndType('#username', userParams.username)
      await page.type('#password', userParams.password)
      await page.type('#email', `a${userParams.email}`)
      await page.click('button[type="submit"]')

      const actualText = await page.getText('div[role="alert"]')
      expect(actualText).to.eq(expectedText)
    })

    step('should display alert message when email already found in db', async () => {
      const expectedText = 'Username or email already registered'

      await usersCollection.insertOne(userParams)
      await page.waitAndType('#username', `a${userParams.username}`)
      await page.type('#password', userParams.password)
      await page.type('#email', userParams.email)
      await page.click('button[type="submit"]')

      const actualText = await page.getText('div[role="alert"]')
      expect(actualText).to.eq(expectedText)
    })
  })

  context('display error message when register with username/password/email of invalid format', () => {
    step('should display register form', async () => {
      await page.goto(signupUrl)
      const hasSignupButton = await page.isElementVisible('button[type="submit"]')
      expect(hasSignupButton).to.be.true
    })

    step('should display error message under appropriate input control', async () => {
      const expectedUsernameErrmsg = 'Must be between 3 and 20 characters'
      const expectedPasswordErrmsg = 'Must be between 8 and 20 characters'
      const expectedEmailErrmsg = 'Must be valid email format'
      const usernameInputSelector = '#username'
      const passwordInputSelector = '#password'
      const emailInputSelector = '#email'

      await page.waitAndType(usernameInputSelector, 'ab')
      await page.blur(usernameInputSelector)
      const actualUsernameErrmsg = await page.getText('#username + div.FormikInput_error__m152h')
      expect(actualUsernameErrmsg).to.eq(expectedUsernameErrmsg)

      await page.type(passwordInputSelector, '1234567')
      await page.blur(passwordInputSelector)
      const actualPasswordErrmsg = await page.getText('#password + div.FormikInput_error__m152h')
      expect(actualPasswordErrmsg).to.eq(expectedPasswordErrmsg)

      await page.waitAndType(emailInputSelector, 'usergmail.com')
      await page.blur(emailInputSelector)
      const actualEmailErrmsg = await page.getText('#email + div.FormikInput_error__m152h')
      expect(actualEmailErrmsg).to.eq(expectedEmailErrmsg)
    })

    step('should disable submit button with invalid username and password', async () => {
      const isSubmitBtnDisbled = await page.isElementVisible('button[type="submit"][disabled]')
      expect(isSubmitBtnDisbled).to.be.true
    })
  })
})