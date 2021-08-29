import { useField, ErrorMessage } from 'formik'
import PropTypes from 'prop-types'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import styles from './FormikSelect.module.css'

const FormikSelect = ({ label, ...props }) => {
  const [field, meta] = useField(props)
  const { optList, className, labelColspan, inputControlColspan, ishorizontal } = props

  return (
    <>
      {
        !ishorizontal && (
          <Form.Group controlId={props.id || props.name} className={className}>
          <Form.Label>{ label }</Form.Label>
          <Form.Select
            aria-label={label}
            isInvalid={!!meta.error}
            {...field}
          >
            <option>Select one</option>
            {
              optList.map(elem => <option key={elem.id} value={elem.id}>{elem.val}</option>)
            }
          </Form.Select>
          {
            meta.touched && meta.error && (
              <ErrorMessage component="div" name={field.name} className={styles.error} />
            )
          }
        </Form.Group>
        )
      }

      {
        ishorizontal && (
          <Form.Group as={Row} controlId={props.id || props.name} className={className}>
            <Form.Label column md={labelColspan}>{ label }</Form.Label>
            <Col md={inputControlColspan}>
              <Form.Select
                aria-label={label}
                isInvalid={!!meta.error}
                {...field}
              >
                <option>Select one</option>
                {
                  optList.map(elem => <option key={elem.id} value={elem.id}>{elem.val}</option>)
                }
              </Form.Select>
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

FormikSelect.propTypes = {
  className: PropTypes.string,
  labelColspan: PropTypes.number,
  inputControlColspan: PropTypes.number,
  ishorizontal: PropTypes.oneOf(['true', 'false']),
  optList: PropTypes.arrayOf(PropTypes.object)
}

FormikSelect.defaultProps = {
  className: 'mb-4',
  labelColspan: 2,
  inputControlColspan: 10,
  ishorizontal: 'false',
  optList: []
}

export default FormikSelect