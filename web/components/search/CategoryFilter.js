import PropTypes from 'prop-types'
import HonyaCheckbox from "../ui/HonyaCheckbox"

const CategoryFilter = ({ header, groupName, options, handleFilters }) => {
  return (
    <>
      <h4>{header}</h4>
      <HonyaCheckbox
        options={options}
        name={groupName}
        handleFilters={filters => handleFilters(filters, 'category')}
      />
    </>
  )
}

CategoryFilter.propTypes = {
  header: PropTypes.string.isRequired,
  groupName: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(PropTypes.object)
}

export default CategoryFilter