import { useState, useRef, useContext } from 'react'
import { useRouter } from 'next/router'
import Container from 'react-bootstrap/Container'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import ShowAlert from '../ui/ShowAlert'
import { signin } from '../../libs/apiUtils/auth-api-utils'
import { localStorage_set } from '../../libs/utils/localStorage-utils'
import { AuthContext } from '../../contexts/AuthContext'


const SigninForm = () => {
  const usernameRef = useRef()
  const passwordRef = useRef()
  //const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const router = useRouter()

  const { setUserInAuthContext } = useContext(AuthContext)

  const submitHandler = async (event) => {
    event.preventDefault()

    const username = usernameRef.current.value
    const password = passwordRef.current.value
    setError(null)
    //setLoading(true)

    // ToDo: validation

    try {
      const result = await signin({username, password})

      if(result.user) {
        setUserInAuthContext(result.user)     
        localStorage_set('user', result.user)
      }

      if(result.user.role === 'admin') {
        router.replace('/admin/dashboard')
      } else {
        router.replace('/user/dashboard')
      }
    } catch(err) {
      setError(err.message)
      //setLoading(false)
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
        </Form.Group>

        <Form.Group className="mb-3" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" required ref={passwordRef} />
        </Form.Group>

        <Button type="submit" variant="primary">
          Submit
        </Button>
      </Form>
    </Container>
  )
}

export default SigninForm
