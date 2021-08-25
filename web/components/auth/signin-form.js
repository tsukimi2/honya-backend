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
import { AuthContext } from '../../contexts/AuthContext'
import FormikInput from '../ui/FormikInput'


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

/*
        <form onSubmit={clickSubmit}>
            <div className="form-group">
                <label className="text-muted">Name</label>
                <input
                    type="text"
                    className="form-control"
                    onChange={handleChange}
                    value={name}
                    autoFocus
                    required
                />
            </div>
            <button className="btn btn-outline-primary">Create Category</button>
        </form>
        */

export default SigninForm
