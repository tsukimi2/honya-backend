import Image from 'next/image'
import Link from 'next/link'
import PropTypes from 'prop-types'
import moment from 'moment'
import Card from 'react-bootstrap/Card'
import Badge from 'react-bootstrap/Badge'
import BtnAddToCart from '../ui/BtnAddToCart'
import slugify from 'react-slugify'
import styles from './ProductCard.module.css'

const ProductCard = ({ fullCard, shortCard, id, name, description, price, category, createdAt, quantity }) => {
  //const photoUrl = `${API_PREFIX}/products/${id}/photo`
  const photoUrl = '/images/ancient_greece.jpg'
  const slug = slugify(name)
  const isFullCard = fullCard === 'true' ? true : false
  const isShortCard = shortCard === 'true' ? true : false

  const showStock = quantity => {
    return quantity > 0 ? (
      <Badge pill bg="primary">In Stock</Badge>
    ) : (
      <Badge pill bg="danger">Out of Stock</Badge>
    )
  }

  return (
    <Card style={{ width: '25rem', margin: '1.5rem 1rem', outlineColor: 'grey' }}>
      <Link href={`/product/${slug}/${id}`}>
        <Card.Title className={styles.header}>{name}</Card.Title>
      </Link>
      <Image
        src={photoUrl}
        alt={name}
        layout="responsive"
        width={45}
        height={60}
        className={styles.img}
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
      <Card.Footer className={styles.footer}>
        <BtnAddToCart />
      </Card.Footer>
    </Card>
  )
}

ProductCard.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  description: PropTypes.string,
  price: PropTypes.number,
  category: PropTypes.string,
  createdAt: PropTypes.string,
  quantity: PropTypes.number,
  fullCard: PropTypes.string,
  shortCard: PropTypes.string,
}

ProductCard.defaultProps = {
  description: '',
  category: '',
  createdAt: '',
  quantity: 0,
  fullCard: 'false',
  shortCard: 'false,'
}

export default ProductCard