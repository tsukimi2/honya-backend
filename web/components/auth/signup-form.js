import { useState } from 'react'
import Container from 'react-bootstrap/Container'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import { Formik } from 'formik'
import * as Yup from 'yup'
import _ from 'lodash-core'
import { ToastContainer, toast } from 'react-toastify'
import Skeleton from 'react-loading-skeleton'
import ShowAlert from '../ui/ShowAlert'
import { signup } from '../../libs/apiUtils/auth-api-utils'
import FormikInput from '../ui/FormikInput'


const SignupForm = () => {
  const [error, setError] = useState(null)

  const submitHandler = async (values) => {
    const { username, password, email } = values
    let submitSuccess = false

    try {
      await signup(username, password, email)
      // setSuccess(true)
      setError(null)
      toast.success('User registration successful', {
        toastId: 'userRegSucessToastId',
      })
      submitSuccess = true
    } catch(err) {
      if(err.message === 'duplicate key') {    
        setError('Username or email already registered')
      } else {
        setError(err.message)
      }
    }

    return submitSuccess
  }

  return (
    <Container md={{ span: 8, offset: 2 }} className="mt-4">
      {
        error && (
          <ShowAlert alertLevel="danger">{error}</ShowAlert>
        )
      }

      <Formik 
        initialValues={{
          username: '',
          password: '',
          email: '',
        }}
        validationSchema={
          Yup.object({
            username: Yup.string()
              .required('Required')
              .min(3, 'Must be between 3 and 20 characters')
              .max(20, 'Must be between 3 and 20 characters')
              .matches(/^[a-zA-Z0-9_-]+$/, { 
                excludeEmptyString: true,
                message: 'Only alphanumeric characters and - and _'
              }),
            password: Yup.string()
              .required('Required')
              .min(8, 'Must be between 8 and 20 characters')
              .max(20, 'Must be between 8 and 20 characters')
              .matches(/^[a-zA-Z0-9_-]+$/, { 
                excludeEmptyString: true,
                message: 'Only alphanumeric characters and - and _'
              }),
            email: Yup.string().email('Must be valid email format')
              .required('Required')
          })
        }
        onSubmit={async (values, {resetForm}) => {
          const isSubmitSuccess = await submitHandler(values)
          if(isSubmitSuccess) {         
            resetForm()
          }
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
              <FormikInput
                label="Email"
                name="email"
                type="email"
                className="mb-4"
              />
    
              <Button type="submit" variant="primary" disabled={isSubmitting || !(_.isEmpty(errors))}>
                Submit
              </Button>
            </Form> || <Skeleton count={10} />
          )
        }
      </Formik>
      <ToastContainer
        position="bottom-center"
        autoClose={5}
        limit={1}
        hideProgressBar
        draggable={false}
      />
    </Container>
  )
}

export default SignupForm