import { useField, ErrorMessage } from 'formik'
import Form from 'react-bootstrap/Form'
import PropTypes from 'prop-types'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import styles from './FormikInput.module.css'

const FormikInput = ({ label, ...props }) => {
  const [field, meta] = useField(props)
  const labelColspan = props.labelColspan ? props.labelColspan : 2
  const inputControlColspan = props.inputControlColspan ? props.inputControlColspan : 10
  const isHorizontal = props.ishorizontal === 'true' ? true : false

  return (
    <>
      {
        !isHorizontal && (
          <Form.Group className="{className}" controlId={props.id || props.name}>
            <Form.Label>{label}</Form.Label>
            <Form.Control
              isInvalid={!!meta.error}
              {...field}
              {...props}
            />
  
          {
            meta.touched && meta.error && (
              <ErrorMessage component="div" name={field.name} className={styles.error} />
            )
          }
          </Form.Group>
        )
      }

      {
        isHorizontal && (
          <Form.Group as={Row} className="{className}" controlId={props.id || props.name}>
            <Form.Label column sm={labelColspan}>{label}</Form.Label>
            <Col sm={inputControlColspan}>
              <Form.Control
                isInvalid={!!meta.error}
                {...field}
                {...props}
              />
            </Col>

          {
            meta.touched && meta.error && (
              <ErrorMessage component="div" name={field.name} className={styles.error} />
            )
          }
          </Form.Group>
        )
      }
    </>
  )
}

FormikInput.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['text', 'password', 'email']).isRequired,
  className: PropTypes.string,
  placeholder: PropTypes.string,
}

export default FormikInput