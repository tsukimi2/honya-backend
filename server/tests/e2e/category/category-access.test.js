import { expect } from 'chai'
import { step } from 'mocha-steps'
import Page from '../../libs/builder.js'
import config from '../../../src/libs/config/index.js'
import { connectToMongodb } from '../../libs/mongodb.js'

describe('e2e category', () => {
  context('Able to access Category page with admin credentials', () => {

  })

  context('Redirected to user dashboard when trying to access Category page with user-level credentials', () => {
    
  })

  context('Redirected to sign-in page when trying to access Category page without logging in', () => {
    
  })
})