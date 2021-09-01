import Image from 'next/image'
import Link from 'next/link'
import PropTypes from 'prop-types'
import Card from 'react-bootstrap/Card'
import BtnAddToCart from '../ui/BtnAddToCart'
import styles from './ProductCard.module.css'
// import { API_PREFIX } from '../../config'

const ProductCard = ({ name, description, price }) => {
  //const photoUrl = `${API_PREFIX}/products/${id}/photo`
  const photoUrl = '/images/ancient_greece.jpg'

  return (
    <Card style={{ width: '25rem', margin: '1.5rem 1rem', outlineColor: 'grey' }}>
      <Link href="/">
        <Card.Title className={styles.header}>{name}</Card.Title>
      </Link>
      <Link href="/">
        <Image
          src={photoUrl}
          alt={name}
          layout="responsive"
          width={45}
          height={60}
          className={styles.img}
        />
      </Link>

      <Card.Body className={styles.body}>
        <Card.Text>
          Description: {description.substring(0, 100)}
        </Card.Text>
        <Card.Text>
          Price: {price}
        </Card.Text>
      </Card.Body>
      <Card.Footer className={styles.footer}>
        <BtnAddToCart />
      </Card.Footer>
    </Card>
  )
}

ProductCard.propTypes = {
  name: PropTypes.string.isRequired,
  description: PropTypes.string,
  price: PropTypes.number.isRequired,
}

ProductCard.defaultProps = {
  description: ''
}

export default ProductCard