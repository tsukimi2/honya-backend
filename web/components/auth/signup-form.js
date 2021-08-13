import { useState, useRef } from 'react'
import ShowError from '../ui/show-error'
import { signup } from '../../libs/apiUtils/auth-api-utils'

const SignupForm = () => {
  const usernameRef = useRef()
  const passwordRef = useRef()
  const emailRef = useRef()
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(null)

  const submitHandler = async (event) => {
    event.preventDefault()

    const username = usernameRef.current.value
    const password = passwordRef.current.value
    const email = emailRef.current.value

    // ToDo: validation

    try {
      const result = await signup(username, password, email)
      console.log('result')
      console.log(result)
      // setSuccess(true)
    } catch(err) {
      setError(err.message)
    }
  }

  return (
    <div className="container col-md-8 offset-md-2">
      {
        error && (
          <ShowError>{error}</ShowError>
        )
      }

      <form onSubmit={submitHandler}>
        <div className="mb-3">
          <label htmlFor="username" className="form-label text-muted">Username</label>
          <input type="text" className="form-control" id="username" required ref={usernameRef} />
        </div>

        <div className="mb-3">
          <label htmlFor="password" className="form-label text-muted">Password</label>
          <input type="password" className="form-control" id="password" required ref={passwordRef} />
        </div>

        <div className="mb-3">
          <label htmlFor="email" className="form-label text-muted">Email</label>
          <input type="email" className="form-control" id="email" required ref={emailRef} />
        </div>

        <button type="submit" className="btn btn-primary">
            Submit
        </button>
      </form>
    </div>
  )
}

export default SignupForm