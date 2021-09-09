import Accordion from 'react-bootstrap/Accordion'
import ProductItem from './ProductItem'

const ProductList = ({ products }) => {
  return (
    <Accordion>
    {
      products.map((product, idx) => (
        <ProductItem
          key={idx}
          pIndex={idx}
          product={product}
        />
      ))
    }
    </Accordion>
  )
}

export default ProductList