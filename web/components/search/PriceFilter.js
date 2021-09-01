import PropTypes from 'prop-types'
import HonyaRadioBox from "../ui/HonyaRadioBox"

const PriceFilter = ({ header, groupName, options, handleFilters }) => {
  return (
    <>
      <h4>{header}</h4>
      <HonyaRadioBox
        options={options}
        name={groupName}
        handleFilters={filters => handleFilters(filters, 'price')}
      />
    </>
  )
}

PriceFilter.propTypes = {
  header: PropTypes.string.isRequired,
  groupName: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(PropTypes.object)
}

export default PriceFilter