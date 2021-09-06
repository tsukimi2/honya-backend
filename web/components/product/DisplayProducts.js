import PropTypes from 'prop-types'
import ProductCard from "./ProductCard"

const DisplayProducts = ({ header, products }) => {
  return (
    <>
      <h2 className="mb-4">{header}</h2>
      {
        products.map(elem =>
          <ProductCard
            key={elem._id}
            id={elem._id}
            name={elem.name}
            description={elem.description}
            price={elem.price}
            category={elem.category.name}
            createdAt={elem.createdAt}
            quantity={elem.quantity}
          />)
      }
    </>
  )
}

DisplayProducts.propTypes = {
  header: PropTypes.string.isRequired,
  products: PropTypes.arrayOf(PropTypes.object)
}

DisplayProducts.defaultProps = {
  products: []
}

export default DisplayProducts