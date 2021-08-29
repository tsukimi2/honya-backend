import { expect } from 'chai'
import { step } from 'mocha-steps'
import Page from '../../libs/builder.js'
import LoginPage from '../../libs/LoginPage.js'
import config from '../../../src/libs/config/index.js'
import { connectToMongodb } from '../../libs/mongodb.js'
import { generateUserParams } from '../../factories/userFactory.js'


function delay(time) {
  return new Promise(function(resolve) { 
      setTimeout(resolve, time)
  })
}

describe.skip('e2e category', () => {
  let page = null
  let loginPage = null
  //const loginUrl = 'http://honya.co.jp/signin'
  const loginUrl = `${config.get('uri:test_base_href')}/signin`
  const createCategoryUrl = `${config.get('uri:test_base_href')}/admin/category`

  let userParams = null
  let adminParams = null

  let dbclient = null
  let db = null
  let usersCollection = null
  let categoriesCollection = null
  let expectedCategories = []

  before(async () => {
    dbclient = await connectToMongodb()
    db = dbclient.db('honya')
    usersCollection = db.collection('users')

    await usersCollection.deleteMany({ "username": /^user*/ })
    await usersCollection.deleteMany({ "username": /^admin*/ })

    userParams = await generateUserParams({ userProfile: 'validUser1', hasHashedPassword: true  })
    adminParams = await generateUserParams({ userProfile: 'validAdmin1', hasHashedPassword: true  })
    const users = [userParams, adminParams]
    // await usersCollection.insertOne(userParams)
    await usersCollection.insertMany(users)

    categoriesCollection = db.collection('categories')
   
    await categoriesCollection.deleteMany({ name: /^cat*/ })
    expectedCategories = [
      { name: 'cat1' },
      { name: 'cat2' }
    ]
    // await categoriesCollection.insertMany(expectedCategories)

    page = await Page.build('Desktop')
    loginPage = await new LoginPage(page)
  })

  after(async () => {
    await page.close()
    //await usersCollection.deleteMany({ "username": /^user*/ })
    //await usersCollection.deleteMany({ "username": /^admin*/ })
    //await categoriesCollection.deleteMany({ name: /^cat*/ })

    await dbclient.close()
  })

  describe('Able to access Category page with admin credentials', () => {
    before(async () => {
      await page.goto(loginUrl)   
      await loginPage.login(adminParams.username, adminParams.password)

      await page.goto(createCategoryUrl)
    })

    after(async () => {
      // await page.waitAndClick('button[type="button"][class^="menu_signoutBtn"]')
    })


    describe('e2e list categories', () => {
      context('should render category list when there are categories in db', () => {
        it('should render category list when there are categories in db', async () => {
          //const numItems = await page.getCount('div[class^="CrudListItem_listItem"]')
          //expect(numItems).to.eq(expectedCategories.length)
        })
      })
    })


    describe('e2e add category', async () => {
      it('should add new category into category list', async () => {
        await delay(1000)
console.log('kon')        
        await page.goto(createCategoryUrl)
console.log('kon2')          
        await delay(1000)
        await page.waitAndType('#name', 'cat1')
console.log('kon3')          
        await page.waitAndClick('button[type="submit"]')
        const numItems = await page.getCount('div[class^="CrudListItem_listItem"]')
        expect(numItems).to.have.lengthOf(1)
      })
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
