import PropTypes from 'prop-types'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import ProductCard from '../product/ProductCard'
import LoadingOverlay from '../ui/LoadingOverlay'
import RelatedProducts from '../product/RelatedProducts'

const ProductPageComponent = ({ isLoadingProduct, isLoadingRelatedProducts, product, relatedProducts }) => {
  return (
    <>
      <Container fluid className="mt-4">
        <Row>
          <Col md={8}>
            {
              isLoadingProduct && <LoadingOverlay />
            }
            {
              product && (
                <ProductCard
                  fullCard='true'
                  id={product._id}
                  name={product.name}
                  description={product.description}
                  price={product.price}
                  category={product.category.name}
                  createdAt={product.createdAt}
                  quantity={product.quantity}
                />
              )
            }
          </Col>
          <Col md={4}>
            {
              isLoadingRelatedProducts && <LoadingOverlay />
            }
            <RelatedProducts
              relatedProducts={relatedProducts}
            />
          </Col>
        </Row>
      </Container>
    </>
  )
}

ProductPageComponent.propTypes = {
  isLoadingProduct: PropTypes.bool.isRequired,
  isLoadingRelatedProducts: PropTypes.bool.isRequired,
  product: PropTypes.object,
  relatedProducts: PropTypes.arrayOf(PropTypes.object).isRequired
}

export default ProductPageComponent