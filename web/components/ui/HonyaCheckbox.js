import { useState } from 'react'
import PropTypes from 'prop-types'
import Form from 'react-bootstrap/Form'

const FormikCheckbox = ({ options, name, handleFilters }) => {
  const [checked, setChecked] = useState([])

  const handleToggle = id => () => {
    const currCheckedIdIndex = checked.indexOf(id)
    const newChecked = [...checked]

    // if currently checked was not already in checked state --> push
    // else pull/take off
    if(currCheckedIdIndex === -1) {
      newChecked.push(id)
    } else {
      newChecked.splice(currCheckedIdIndex, 1)
    }

    setChecked(newChecked)
    handleFilters(newChecked)
  }

  return (
    options.map(elem => (
      <Form.Check 
        type="checkbox"
        key={elem.id}
        id={`${name}_${elem.id}`}
        name={name}
        label={elem.label}
        value={checked.indexOf(elem.id) === -1}
        onChange={handleToggle(elem.id)}
      />
    ))
  )
}

FormikCheckbox.propTypes = {
  options: PropTypes.arrayOf(PropTypes.object).isRequired,
  name: PropTypes.string.isRequired,
}

export default FormikCheckbox