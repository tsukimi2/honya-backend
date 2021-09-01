// import { useState } from 'react'
import PropTypes from 'prop-types'
import Form from 'react-bootstrap/Form'


const HonyaRadioBox = ({ options, name, handleFilters }) => {
  //const [value, setValue] = useState(0)

  const handleChange = event => {
    handleFilters(event.target.value)
    //setValue(event.target.value)
  }

  return (
    options.map(elem => (
      <Form.Check 
        type="radio"
        key={elem.id}
        id={`${name}_$(elem.id}`}
        name={name}
        label={elem.label}
        value={elem.id}
        onChange={handleChange}
      />
    ))
  )
}

HonyaRadioBox.propTypes = {
  options: PropTypes.arrayOf(PropTypes.object).isRequired,
  name: PropTypes.string.isRequired
}

export default HonyaRadioBox