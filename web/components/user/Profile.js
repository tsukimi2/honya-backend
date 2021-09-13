import { useState } from 'react'
import PropTypes from 'prop-types'
import * as Yup from 'yup'
import _ from 'lodash-core'
import Container from 'react-bootstrap/Container'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import { Formik } from 'formik'
import { ToastContainer, toast } from 'react-toastify'
import FormikInput from '../ui/FormikInput'
import ShowAlert from '../ui/ShowAlert'
import { updateUser } from '../../libs/apiUtils/user-api-utils'
import PasswordStrengthMeter from '../ui/PasswordStrengthMeter'


const Profile = ({ user }) => {
  const [enteredPassword, setEnteredPassword] = useState('')
  const [error, setError] = useState(null)

  const submitHandler = async (values) => {
    const { confirmPassword } = values
    let submitSuccess = false

    try {
      // await signup(username, password, email)
      // setSuccess(true)
      
      // update user
      await updateUser({
        user: { ...user, password: confirmPassword }
      })

      // update AuthContext if successful
      //authDispatch({ type: 'SET_USER', user: storedUser })

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

  const handlePasswordChange = (password) => {
    setEnteredPassword(password)
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
          username: user.username,
          password: '',
          confirmPassword: '',
          email: user.email,
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
              confirmPassword: Yup.string()
                .required('Confirm Password is required')
                .oneOf([Yup.ref('password'), null], 'Passwords must match')
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
          ({ handleSubmit, handleChange, errors, isSubmitting }) => (
            <Form onSubmit={handleSubmit}>
              <FormikInput
                label="Username"
                name="username"
                type="text"
                className="mb-4"
                disabled
                handleChange={handleChange}
              />
              <FormikInput
                label="Password"
                name="password"
                type="password"
                className="mb-1"
                handleChange={handleChange}
                handleInputChange={handlePasswordChange}
              />
              {
                enteredPassword && (
                  <PasswordStrengthMeter
                    password={enteredPassword}
                    className="mb-4"
                  />
                )
              }
              <FormikInput
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                className="mb-4"
                handleChange={handleChange}
              />
              <FormikInput
                label="Email"
                name="email"
                type="email"
                className="mb-4"
                disabled
                handleChange={handleChange}
              />
    
              <Button type="submit" variant="primary" disabled={isSubmitting || !(_.isEmpty(errors))}>
                Submit
              </Button>
            </Form>
          )
        }
      </Formik>
      <ToastContainer
        position="bottom-center"
        autoClose={10}
        limit={1}
        hideProgressBar
        draggable={false}
      />
    </Container>
  )
}

Profile.propTypes = {
  user: PropTypes.object.isRequired
}
 
export default Profile