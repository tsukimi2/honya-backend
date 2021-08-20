import { renderWithAuthContext, screen, waitFor } from '../../../tests/test-utils/testing-library-context-utils'
import userEvent from '@testing-library/user-event'
import { rest } from 'msw'
import { server } from '../../../mocks/server'
import SignupForm from '../signup-form'

describe('Signin form', () => {
  let username = ''
  let password = ''
  let email = ''

  let usernameInputControl = null
  let passwordInputControl = null
  let emailInputControl = null
  let submitBtn = null

  beforeEach(() => {
    username = 'user1'
    password = 'testing1'
    email = `${username}@gmail.com`

    renderWithAuthContext(<SignupForm />)

    usernameInputControl = screen.getByRole('textbox', { name: 'Username' })
    passwordInputControl = screen.getByLabelText('Password')
    emailInputControl = screen.getByRole('textbox', { name: 'Email' })
    submitBtn = screen.getByRole('button', { name: 'Submit' })
  })

  it('should sign up successfully showing success notification with valid username, password, and email', async () => {
    const username = 'user1'
    const password = 'testing1'
    const email = `${username}@gmail.com`

    userEvent.type(usernameInputControl, username)
    userEvent.type(passwordInputControl, password)
    userEvent.type(emailInputControl, email)
    userEvent.click(submitBtn)

    const alert = await screen.findByText('User registration successful')
    expect(alert).toBeInTheDocument()
  })

  it('should display alert banner if username/email already found in db', async () => { 
    // reset server error response
    server.resetHandlers(
      rest.post('/api/v1/register', (req, res, ctx) => {
        return res(
          ctx.status(400),
          ctx.json({
            err: "DatabaseError",
            errmsg: "duplicate key"
          })
        )
      })
    )

    userEvent.type(usernameInputControl, username)
    userEvent.type(passwordInputControl, password)
    userEvent.type(emailInputControl, email)
    userEvent.click(submitBtn)

    const alert = await screen.findByText('Username or email already registered')
    expect(alert).toBeInTheDocument()
  })

  describe('Testing username', () => {
    it('should display error message when username is empty', async () => {
      userEvent.type(usernameInputControl, username)
      userEvent.clear(usernameInputControl)
      userEvent.type(passwordInputControl, password)
      userEvent.type(emailInputControl, email)

      const errmsg = await screen.findByText('Required')
      expect(errmsg).toBeInTheDocument()
    })

    it('should display error message with username shorter than length 3', async () => {
      const username = 'us'

      userEvent.type(usernameInputControl, username)
      userEvent.type(passwordInputControl, password)
      userEvent.type(emailInputControl, email)

      const errmsg = await screen.findByText('Must be between 3 and 20 characters')
      expect(errmsg).toBeInTheDocument()
    })

    it('should display error message with username longer than length 20', async () => {
      const username = '123456789012345678901'

      userEvent.type(usernameInputControl, username)
      userEvent.type(passwordInputControl, password)
      userEvent.type(emailInputControl, email)

      const errmsg = await screen.findByText('Must be between 3 and 20 characters')
      expect(errmsg).toBeInTheDocument()
    })

    it('should display error message with username having invalid characters', async () => {
      const username = 'user1*'

      userEvent.type(usernameInputControl, username)
      userEvent.type(passwordInputControl, password)
      userEvent.type(emailInputControl, email)

      const errmsg = await screen.findByText('Only alphanumeric characters', { exact: false })
      expect(errmsg).toBeInTheDocument()
    })
  })

  describe('Testing password', () => {
    it('should be invalid with empty password', async () => {
      userEvent.type(usernameInputControl, username)
      userEvent.type(passwordInputControl, password)
      userEvent.clear(passwordInputControl)
      userEvent.type(emailInputControl, email)

      const errmsg = await screen.findByText('Required')
      expect(errmsg).toBeInTheDocument()
    })

    it('should display error message with password less than length 8', async () => {
      const password = '1234567'

      userEvent.type(usernameInputControl, username)
      userEvent.type(passwordInputControl, password)
      userEvent.type(emailInputControl, email)
      userEvent.click(submitBtn)

      const errmsg = await screen.findByText('Must be between 8 and 20 characters')
      expect(errmsg).toBeInTheDocument()
    })

    it('should display error message password greater than length 20', async () => {
      const password = '123456789012345678901'

      userEvent.type(usernameInputControl, username)
      userEvent.type(passwordInputControl, password)
      userEvent.type(emailInputControl, email)
      userEvent.click(submitBtn)

      const errmsg = await screen.findByText('Must be between 8 and 20 characters')
      expect(errmsg).toBeInTheDocument()
    })

    it('should display error message with username having invalid characters', async () => {
      const password = 'testing1&$'

      userEvent.type(usernameInputControl, username)
      userEvent.type(passwordInputControl, password)
      userEvent.type(emailInputControl, email)
      userEvent.click(submitBtn)

      const errmsg = await screen.findByText('Only alphanumeric characters', { exact: false })
      expect(errmsg).toBeInTheDocument()
    })
  })

  describe('Testing email', () => {
    it('should display error message with invalid email', async () => {
      const email = 'user1gmail.com'

      userEvent.type(usernameInputControl, username)
      userEvent.type(passwordInputControl, password)
      userEvent.type(emailInputControl, email)
      userEvent.click(submitBtn)

      const errmsg = await screen.findByText('Must be valid email format')
      expect(errmsg).toBeInTheDocument()
    })
  })
})