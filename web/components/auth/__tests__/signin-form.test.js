import { renderWithAuthContext, screen, waitFor } from '../../../tests/test-utils/testing-library-context-utils'
import userEvent from '@testing-library/user-event'
import { rest } from 'msw'
import { server } from '../../../mocks/server'
import SigninForm from '../signin-form'

describe('Signin form', () => {
  let usernameInputControl = null
  let passwordInputControl = null
  let submitBtn = null

  // https://github.com/vercel/next.js/discussions/23034
  const useRouter = jest.spyOn(require('next/router'), 'useRouter')
  useRouter.mockImplementationOnce(() => ({
    replace: () => {},
  }))

  beforeEach(() => {
    renderWithAuthContext(<SigninForm />)

    usernameInputControl = screen.getByRole('textbox', { name: 'Username' })
    passwordInputControl = screen.getByLabelText('Password')
    submitBtn = screen.getByRole('button', { name: 'Submit' })
  })

  it('should sign in successfully with valid username and password', async () => {
    const username = 'user1'
    const password = 'testing1'

    userEvent.type(usernameInputControl, username)
    userEvent.type(passwordInputControl, password)
    userEvent.click(submitBtn)

    await waitFor(() => {
      const alert = screen.queryByRole('alert')
      expect(alert).toBeNull()
    })
  })

  it('should display alert banner if credentials not found in db', async () => {
    const username = 'user1'
    const password = 'testing1'
    const errmsg = 'Invalid username/password'

    // reset server error response
    server.resetHandlers(
      rest.post('/api/v1/login', (req, res, ctx) => {
        return res(
          ctx.status(401),
          ctx.json({ err: 'UnauthorizedError', errmsg })
        )
      })
    )

    userEvent.type(usernameInputControl, username)
    userEvent.type(passwordInputControl, password)
    userEvent.click(submitBtn)

    const alert = await screen.findByRole('alert')
    expect(alert).toBeInTheDocument()
  })

  describe('Testing username', () => {
    it('should display error message when username is empty', async () => {
      const username = 'user1'
      const password = 'testing1'

      userEvent.type(usernameInputControl, username)
      userEvent.clear(usernameInputControl)
      userEvent.type(passwordInputControl, password)

      const errmsg = await screen.findByText('Required')
      expect(errmsg).toBeInTheDocument()
    })
    
    it('should display error message with username shorter than length 3', async () => {
      const username = 'us'
      const password = 'testing1'

      userEvent.type(usernameInputControl, username)
      userEvent.type(passwordInputControl, password)

      const errmsg = await screen.findByText('Must be between 3 and 20 characters')
      expect(errmsg).toBeInTheDocument()
    })

    it('should display error message with username longer than length 20', async () => {
      const username = '123456789012345678901'
      const password = 'testing1'

      userEvent.type(usernameInputControl, username)
      userEvent.type(passwordInputControl, password)

      const errmsg = await screen.findByText('Must be between 3 and 20 characters')
      expect(errmsg).toBeInTheDocument()
    })

    it('should display error message with username having invalid characters', async () => {
      const username = 'user1*'
      const password = 'testing1'

      userEvent.type(usernameInputControl, username)
      userEvent.type(passwordInputControl, password)

      const errmsg = await screen.findByText('Only alphanumeric characters', { exact: false })
      expect(errmsg).toBeInTheDocument()
    })
  })

  describe('Testing password', () => {
    it('should be invalid with empty password', async () => {
      const username = 'user1'
      const password = 'testing1'

      userEvent.type(usernameInputControl, username)
      userEvent.type(passwordInputControl, password)
      userEvent.clear(passwordInputControl)
      userEvent.click(submitBtn)

      const errmsg = await screen.findByText('Required')
      expect(errmsg).toBeInTheDocument()
    })

    it('should display error message with password less than length 8', async () => {
      const username = 'user1'
      const password = '1234567'

      userEvent.type(usernameInputControl, username)
      userEvent.type(passwordInputControl, password)
      userEvent.click(submitBtn)

      const errmsg = await screen.findByText('Must be between 8 and 20 characters')
      expect(errmsg).toBeInTheDocument()
    })

    it('should display error message password greater than length 20', async () => {
      const username = 'user1'
      const password = '123456789012345678901'

      userEvent.type(usernameInputControl, username)
      userEvent.type(passwordInputControl, password)
      userEvent.click(submitBtn)

      const errmsg = await screen.findByText('Must be between 8 and 20 characters')
      expect(errmsg).toBeInTheDocument()
    })

    it('should display error message with username having invalid characters', async () => {
      const username = 'user1'
      const password = 'testing1&$'

      userEvent.type(usernameInputControl, username)
      userEvent.type(passwordInputControl, password)
      userEvent.click(submitBtn)

      const errmsg = await screen.findByText('Only alphanumeric characters', { exact: false })
      expect(errmsg).toBeInTheDocument()
    })
  })
})