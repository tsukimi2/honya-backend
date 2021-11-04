import { useContext } from 'react'
// import Image from 'next/image'
import { useRouter } from 'next/router'
import PropTypes from 'prop-types'
import moment from 'moment'
import Card from 'react-bootstrap/Card'
import Badge from 'react-bootstrap/Badge'
import Button from 'react-bootstrap/Button'
import slugify from 'react-slugify'
import { addItemToCart, getNumItemsInCart } from '../../libs/utils/cartHelpers'
import { CartContext } from '../../contexts/CartContextProvider'
import styles from './ProductCard.module.css'
import { API_PREFIX } from '../../config'

/* eslint-disable @next/next/no-img-element */
const ProductCard = ({ id, name, description, price, category, createdAt, quantity, fullCard, shortCard, showAddToCardBtn }) => {
  // https://stackoverflow.com/questions/66756073/how-to-use-dynamic-link-in-next-js-image
  const photoUrl = `${API_PREFIX}/products/${id}/photo`
  const slug = slugify(name)
  const isFullCard = fullCard === 'true' ? true : false
  const isShortCard = shortCard === 'true' ? true : false
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

  return (
    <Card style={{ width: '25rem', margin: '1.5rem 1rem', outlineColor: 'grey' }}>
      <Card.Title className={styles.header} onClick={handleForwardLink}>{name}</Card.Title>
      <img
        src={photoUrl}
        alt={name}
        layout="responsive"
        width={245}
        height={260}
        className={styles.img}
        onClick={handleForwardLink}
      />

      <Card.Body className={styles.body}>
        {
          !isShortCard && isFullCard && (
            <Card.Text>
              Description: {description}
            </Card.Text>
          )
        }
        {
          !isShortCard && !isFullCard && (
            <Card.Text>
              Description: {description.substring(0, 50)}
            </Card.Text>
          )
        }
        <Card.Text>
          Price: {price}
        </Card.Text>
        {
          isFullCard && (
            <>
              <Card.Text>
                Category: {category}
              </Card.Text>
              <Card.Text>
                Added {moment(createdAt).fromNow()}
              </Card.Text>
              <Card.Text>
                {showStock(quantity)}
              </Card.Text>
            </>
          )
        }
      </Card.Body>
      {
        !isShortCard && showAddToCardBtn && (
          <Card.Footer className={styles.footer}>
            <Button variant="primary" onClick={addToCart}>Add To Cart</Button>
          </Card.Footer>
        )
      }
    </Card>
  )
}

ProductCard.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  category: PropTypes.string.isRequired,
  createdAt: PropTypes.string.isRequired,
  quantity: PropTypes.number.isRequired,
  fullCard: PropTypes.string,
  shortCard: PropTypes.bool,
  showAddToCardBtn: PropTypes.bool
}

ProductCard.defaultProps = {
  description: '',
  category: '',
  createdAt: '',
  quantity: 0,
  fullCard: 'false',
  shortCard: false,
  showAddToCardBtn: true,
}
/* eslint-disable @next/next/no-img-element */

export default ProductCard