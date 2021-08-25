import { Formik } from "formik"
import FormikInput from "../ui/FormikInput"
import Form from 'react-bootstrap/Form'
import { MDBBtn } from 'mdb-react-ui-kit'
import _ from 'lodash-core'
import * as Yup from 'yup'

const CrudForm = ({ frmSubmitHandler, frmLabelName, frmInputPlaceholder, frmSubmitBtnTxt, ishorizontalFrm }) => {

  return (
    <Formik
      initialValues={{
        name: '',
      }}
      validationSchema={
        Yup.object({
          name: Yup.string()
            .required('Required')
            .min(3, 'Must be between 3 and 20 characters')
            .max(20, 'Must be between 3 and 20 characters')
            .matches(/^[a-zA-Z0-9_-]+$/, { 
              excludeEmptyString: true,
              message: 'Only alphanumeric characters and - and _'
            })
        })
      }
      onSubmit={async (values, {resetForm}) => {
        const isSubmitSuccess = await frmSubmitHandler(values)
        if(isSubmitSuccess) {        
          resetForm()
        }
      }}
    >
    {
      ({ handleSubmit, errors, isSubmitting }) => (
        <Form onSubmit={handleSubmit}>
          <Form.Group>

          </Form.Group>
          <FormikInput
            label={frmLabelName}
            name="name"
            type="text"
            className="mb-4"
            ishorizontal={ishorizontalFrm}
            placeholder={frmInputPlaceholder}
          />
      
          <MDBBtn rounded type="submit" color="primary" disabled={isSubmitting || !(_.isEmpty(errors))}>
            { frmSubmitBtnTxt || 'Submit' }
          </MDBBtn>
        </Form>
      )
    }
  </Formik>
  )
}

export default CrudForm