import { Formik } from "formik"
import FormikInput from "../ui/FormikInput"
import Form from 'react-bootstrap/Form'
import { MDBBtn } from 'mdb-react-ui-kit'
import _ from 'lodash-core'
import * as Yup from 'yup'
import PropTypes from 'prop-types'

const CrudForm = ({
  frmSubmitHandler, frmLabelName, frmInputPlaceholder, frmSubmitBtnTxt, crudFormvalidationSchema, ishorizontalFrm
}) => {
  return (
    <Formik
      initialValues={{
        name: '',
      }}
      validationSchema={
        Yup.object(crudFormvalidationSchema)
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

CrudForm.propTypes = {
  frmSubmitHandler: PropTypes.func.isRequired,
  frmLabelName: PropTypes.string.isRequired,
  frmInputPlaceholder: PropTypes.string,
  frmSubmitBtnTxt: PropTypes.string,
  crudFormvalidationSchema: PropTypes.object,
  ishorizontalFrm: PropTypes.oneOf([ 'true', 'false' ])
}

CrudForm.defaultProps = {
  frmInputPlaceholder: '',
  frmSubmitBtnTxt: 'Submit',
  crudFormvalidationSchema: {},
  ishorizontalFrm: false
}

export default CrudForm