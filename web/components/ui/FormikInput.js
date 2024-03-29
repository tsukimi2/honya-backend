import { useField, ErrorMessage } from 'formik'
import Form from 'react-bootstrap/Form'
import PropTypes from 'prop-types'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import styles from './FormikInput.module.css'

const FormikInput = ({ label, ...props }) => {
  const [field, meta] = useField(props)
  const { type, className, labelColspan, inputControlColspan, ishorizontal } = props
  const isHorizontal = ishorizontal === 'true' ? true : false
  let formControlProps = { type }
  if(props.disabled) {
    formControlProps['disabled'] = true
  }

// https://stackoverflow.com/questions/51159477/withformik-how-to-use-handlechange
  const onInputChange = (evt) => {
    const val = evt.target.value
    props.handleInputChange(val)
  }

  return (
    <>
      {
        !isHorizontal && (
          <Form.Group className={className} controlId={props.id || props.name}>
            <Form.Label>{label}</Form.Label>
              {
                !formControlProps.disabled ? (
                  <Form.Control
                    type={type}
                    isInvalid={!!meta.error}
                    {...field}
                    onChange={(e) => {props.handleChange(e); onInputChange(e)}}
                  />
                ) : (
                  <Form.Control
                    type={type}
                    disabled
                    isInvalid={!!meta.error}
                    {...field}
                  />
                )
              }
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
          <Form.Group as={Row} className={className} controlId={props.id || props.name}>
            <Form.Label column md={labelColspan}>{label}</Form.Label>
            <Col md={inputControlColspan}>
              <Form.Control
                type={type}
                isInvalid={!!meta.error}
                {...field}
                onChange={(e) => {props.handleChange(e); onInputChange(e)}}
              />
              {
                meta.touched && meta.error && (
                  <ErrorMessage component="div" name={field.name} className={styles.error} />
                )
              }
            </Col>
          </Form.Group>
        )
      }
    </>
  )
}

FormikInput.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['text', 'password', 'email', 'number']).isRequired,
  className: PropTypes.string,
  placeholder: PropTypes.string,
  ishorizontal: PropTypes.oneOf(['true', 'false']),
  labelColspan: PropTypes.number,
  inputControlColspan: PropTypes.number,
  handleChange: PropTypes.func.isRequired,
  handleInputChange: PropTypes.func,
}

FormikInput.defaultProps = {
  className: 'mb-4',
  type: 'text',
  placeholder: '',
  ishorizontal: 'false',
  labelColspan: 2,
  inputControlColspan: 10,
  handleInputChange: () => {}
}

export default FormikInput