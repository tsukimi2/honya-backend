import { useState, useContext } from 'react'
import { useRouter } from 'next/router'
import Container from 'react-bootstrap/Container'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import ShowAlert from '../ui/ShowAlert'
import { Formik } from 'formik'
import * as Yup from 'yup'
import _ from 'lodash-core'
import { signin } from '../../libs/apiUtils/auth-api-utils'
import { localStorage_set } from '../../libs/utils/localStorage-utils'
// import { useAuthContext } from '../../contexts/AuthContext'
import { AuthContext } from '../../contexts/AuthContext'
import FormikInput from '../ui/FormikInput'

/*
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
  
  ==========================================

  const usernameRef = useRef()
  const passwordRef = useRef()
  //const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  //const [signedInUser, setSignedInUser] = useState(null)
  const router = useRouter()

  // const { setUserInAuthContext } = useContext(AuthContext)
  const { updateUserInAuthContext } = useContext(AuthContext)
  // const [ userInAuthContext, updateUserInAuthContext ]= useAuthContext()
  // const{ updateUserInAuthContext } = useAuthContext()

  
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
        updateUserInAuthContext(result.user, mounted)
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
          <Form.Control type="text" name="username" required ref={usernameRef} />
        </Form.Group>

        <Form.Group className="mb-3" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" name="password" required ref={passwordRef} />
        </Form.Group>

        <Button type="submit" variant="primary">
          Submit
        </Button>
      </Form>
    </Container>
  )
}
*/


const SigninForm = () => {
  const [error, setError] = useState(null)
  const router = useRouter()

  const { updateUserInAuthContext } = useContext(AuthContext)
  
  const submitHandler = async (values) => {
    setError(null)
    //setLoading(true)

    const { username, password } = values

    try {      
      const result = await signin({username, password})
      if(result.user) {
        updateUserInAuthContext(result.user)
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

      <Formik 
        initialValues={{
          username: '',
          password: '', 
        }}
        validationSchema={
          Yup.object({
            username: Yup.string()
              .required('Required')
              .min(3, 'Must be between 3 and 20 characters')
              .max(20, 'Must be between 3 and 20 characters')
              .matches(/^[a-zA-Z0-9_\-]+$/, { 
                excludeEmptyString: true,
                message: 'Only alphanumeric characters and - and _'
              }),
            password: Yup.string()
              .required('Required')
              .min(8, 'Must be between 8 and 20 characters')
              .max(20, 'Must be between 8 and 20 characters')
              .matches(/^[a-zA-Z0-9_\-]+$/, { 
                excludeEmptyString: true,
                message: 'Only alphanumeric characters and - and _'
              })
          })
        }
        onSubmit={async (values) => {
          await submitHandler(values)
        }}
      >
        {
          ({ handleSubmit, errors, isSubmitting }) => (
            <Form onSubmit={handleSubmit}>
              <FormikInput
                label="Username"
                name="username"
                type="text"
                className="mb-4"
              />

              <FormikInput
                label="Password"
                name="password"
                type="password"
                className="mb-4"
              />
      
              <Button type="submit" variant="primary" disabled={isSubmitting || !(_.isEmpty(errors))}>
                Submit
              </Button>
            </Form>
          )
        }
      </Formik>
    </Container>
  )
}

export default SigninForm
