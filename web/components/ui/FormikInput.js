import { useField, ErrorMessage } from 'formik'
import Form from 'react-bootstrap/Form'
import styles from './FormikInput.module.css'

const FormikInput = ({ label, ...props }) => {
  const [field, meta] = useField(props)

  return (
    <>
      <Form.Group className="{className}" controlId={props.id || props.name}>
        <Form.Label>{label}</Form.Label>
        <Form.Control
          type="text"
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
    </>
  )
}

export default FormikInput