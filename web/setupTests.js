import "@testing-library/jest-dom/extend-expect"
import '@testing-library/jest-dom'
import { server } from "./mocks/server"

// const OLD_ENV = process.env

// establish API mocking before all tests
beforeAll(() => {
  server.listen()
})

beforeEach(() => {  
  // jest.resetModules() // clears the cache
  // process.env = { ...OLD_ENV }
})

// rset any request handlers that may have been added during tests
afterEach(() => server.resetHandlers())

// clean up afer tests are finsihed
afterAll(() => {
  // process.env = OLD_ENV
  server.close()
})