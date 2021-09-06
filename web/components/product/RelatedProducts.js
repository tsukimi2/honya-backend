import PropTypes from 'prop-types'
import ProductCard from "./ProductCard"

const RelatedProducts = ({ relatedProducts }) => {
  const shortCard = true
  const renderRelatedProducts = (relatedProducts) => {
    return (
      <>
        <h2>Related Products</h2>
        {
          relatedProducts && Array.isArray(relatedProducts) && relatedProducts.map((elem, idx) => {
            return (
              <div className="mb-3" key={idx}>
                <ProductCard
                  shortCard={shortCard}
                  id={elem._id}
                  name={elem.name}
                  price={elem.price}
                />
              </div>
            )
          })
        }
      </>
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

