import PropTypes from 'prop-types'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
//import ProductCard from '../product/ProductCard'
import HorizontalProductCard from '../product/HorizontalProductCard'
import LoadingOverlay from '../ui/LoadingOverlay'
import RelatedProducts from '../product/RelatedProducts'

const ProductPageComponent = ({ isLoadingProduct, isLoadingRelatedProducts, product, relatedProducts }) => {
  return (
    <>
      <Container fluid className="mt-4">
        <Row>
          <Col md={9}>
            {
              isLoadingProduct && <LoadingOverlay />
            }
            {
              product && (
                <HorizontalProductCard
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
          <Col md={3}>
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

/*
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
                */

ProductPageComponent.propTypes = {
  isLoadingProduct: PropTypes.bool.isRequired,
  isLoadingRelatedProducts: PropTypes.bool.isRequired,
  product: PropTypes.object,
  relatedProducts: PropTypes.arrayOf(PropTypes.object).isRequired
}

export default ProductPageComponent