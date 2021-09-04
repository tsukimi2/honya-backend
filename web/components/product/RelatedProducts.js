import PropTypes from 'prop-types'
import ProductCard from "./ProductCard"

const RelatedProducts = ({ relatedProducts }) => {
  const renderRelatedProducts = (relatedProducts) => {
    return (
      relatedProducts.map((elem, idx) => {
        return (
          <div className="mb-3" key={idx}>
            <ProductCard
              shortCard='true'
              id={elem._id}
              name={elem.name}
              price={elem.price}
            />
          </div>
        )
      })
    )
  }

  return (
    renderRelatedProducts(relatedProducts)
  )
}

RelatedProducts.propTypes = {
  relatedProducts: PropTypes.arrayOf(PropTypes.object)
}

RelatedProducts.defaultProps = {
  relatedProducts: []
}

export default RelatedProducts

