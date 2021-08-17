import { useState, useRef } from 'react'
import Container from 'react-bootstrap/Container'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import ShowAlert from '../ui/ShowAlert'
import { signup } from '../../libs/apiUtils/auth-api-utils'

const SignupForm = () => {
  const usernameRef = useRef()
  const passwordRef = useRef()
  const emailRef = useRef()
  //const [success, setSuccess] = useState(false)
  const [error, setError] = useState(null)

  const submitHandler = async (event) => {
    event.preventDefault()

    const username = usernameRef.current.value
    const password = passwordRef.current.value
    const email = emailRef.current.value

    // ToDo: validation

    try {
      await signup(username, password, email)
      // setSuccess(true)
      setError(null)
    } catch(err) {
      setError(err.message)
    }
  }

  return (
    <Container md={{ span: 8, offset: 2 }}>
      {
        error && (
          <ShowAlert alertLevel="danger">{error}</ShowAlert>
        )
      }

      <Form onSubmit={submitHandler}>
        <Form.Group className="mb-3" controlId="username">
          <Form.Label>Username</Form.Label>
          <Form.Control type="text" required ref={usernameRef} />
          <Form.Text className="text-muted">Username must be xxx characters long.</Form.Text>
        </Form.Group>

        <Form.Group className="mb-3" controlId="password">
          <Form.Label>Username</Form.Label>
          <Form.Control type="password" required ref={passwordRef} />
          <Form.Text className="text-muted">Password must be 8-20 characters long, contain letters and numbers, and must not contain spaces, special characters, or emoji.</Form.Text>
        </Form.Group>

        <Form.Group className="mb-3" controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control type="email" required ref={emailRef} />
        </Form.Group>

        <Button type="submit" variant="primary">
          Submit
        </Button>
      </Form>
    </Container>
  )
}

export default SignupForm