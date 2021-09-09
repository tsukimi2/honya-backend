import Accordion from 'react-bootstrap/Accordion'

const ProductItem = ({ pIndex, product }) => {
  return (
    <Accordion.Item eventKey={pIndex}>
      <Accordion.Header>{product.name}</Accordion.Header>
      <Accordion.Body>
        Price: {product.price}<br />
        Total: {product.count}<br />
        Product ID: {product._id}
      </Accordion.Body>
    </Accordion.Item>
  )
}

export default ProductItem