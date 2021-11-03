import { useContext } from 'react'
import { useRouter } from 'next/router'
import PropTypes from 'prop-types'
import Image from 'next/image'
import Card from 'react-bootstrap/Card'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import Badge from 'react-bootstrap/Badge'
import InputGroup from 'react-bootstrap/InputGroup'
import Form from 'react-bootstrap/Form'
import moment from 'moment'
import slugify from 'react-slugify'
import { CartContext } from '../../contexts/CartContextProvider'
import { addItemToCart, getNumItemsInCart } from '../../libs/utils/cartHelpers'
import { API_PREFIX } from '../../config'


const HorizontalProductCard = ({
  id, name, description, price, category, createdAt, quantity, count, showAddToCardBtn, showCartUpdate, handleCountChange, handleRemoveProduct
}) => {
  //const photoUrl = '/images/ancient_greece.jpg'
  const photoUrl = `${API_PREFIX}/products/${id}/photo`
  const slug = slugify(name)
  const { dispatch: cartDispatch } = useContext(CartContext)
  const router = useRouter()

  const showStock = quantity => {
    return quantity > 0 ? (
      <Badge pill bg="primary">In Stock</Badge>
    ) : (
      <Badge pill bg="danger">Out of Stock</Badge>
    )
  }

  const addToCart = () => {
    const product = {
      _id: id,
      name,
      description,
      price,
      category,
      createdAt,
      quantity
    }
    addItemToCart(product, () => {})
    cartDispatch({
      type: 'SET_ITEMS_COUNT',
      count: getNumItemsInCart()
    })
  }

  const handleForwardLink = () => {
    router.push(`/product/${slug}/${id}`)
  }

  const handleChange = (productId, name) => evt => {
    if(name === 'count') {
      handleCountChange(productId, parseInt(evt.target.value))
    }
  }

  const onRemoveProduct = () => {
    handleRemoveProduct(id)
  }

  return (
    <Card>
      <Container>
        <Row>
          <Col md={3}>
            <Card.Body>
            <Row>
              <img
                src={photoUrl}
                alt='name'
                layout="responsive"
                width={245}
                height={260}
                onClick={handleForwardLink}
              />
            </Row>
            {
              showAddToCardBtn && (
                <Row>
                  <Button variant="primary" onClick={addToCart}>Add To Cart</Button>
                </Row>
              )
            }
            </Card.Body>
          </Col>
          <Col md={9}>
            <Card.Body>
              <Card.Title onClick={handleForwardLink}>{name}</Card.Title>
              {
                (price || price === 0) && (<Card.Text>Price: {price}</Card.Text>)
              }
              {
                category && (<Card.Text>Category: {category}</Card.Text>)
              }
              {
                createdAt && (<Card.Text>Added {moment(createdAt).fromNow()}</Card.Text>)
              }
              {
                (quantity || quantity == 0 ) && (<Card.Text>{showStock(quantity)}</Card.Text>)
              }
              {
                showCartUpdate && (
                  <>
                    <InputGroup className="mb-3">
                      <InputGroup.Text id="basic-addon1">Quantity</InputGroup.Text>
                      <Form.Control
                        type="number"
                        aria-label="count"
                        aria-describedby="basic-addon1"
                        value={count}
                        onChange={handleChange(id, 'count')}
                      />
                    </InputGroup>
                    <Button
                      variant="outline-danger"
                      className="mt-2 mb-2"
                      onClick={onRemoveProduct}
                    >
                      Remove Product
                    </Button>
                  </>
                )
              }
              {
                description && (
                  <Card.Text>Description: {description}</Card.Text>
                )
              }
            </Card.Body>
          </Col>
        </Row>
      </Container>
    </Card>
  )
}

HorizontalProductCard.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  description: PropTypes.string,
  price: PropTypes.number,
  category: PropTypes.string,
  createdAt: PropTypes.string,
  quantity: PropTypes.number,
  storedCount: PropTypes.number,
  showAddToCardBtn: PropTypes.bool,
  showCartUpdate: PropTypes.bool,
  handleCountChange: PropTypes.func,
  handleRemoveProduct: PropTypes.func,
}

HorizontalProductCard.defaultProps = {
  description: '',
  category: '',
  createdAt: '',
  quantity: '',
  showAddToCardBtn: true,
  showCartUpdate: false,
}

export default HorizontalProductCard