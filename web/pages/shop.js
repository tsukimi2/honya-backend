import Shop from '../components/shop/Shop'
import { API_PROTO, API_HOST, API_PREFIX } from '../config'

const ShopPage = ({ initData }) => {
  const categories = initData.initCategories
  const initProducts = initData.initProducts

  return (
    <>
      <Shop
        initProducts={initProducts}
        initCategories={categories}
      />
    </>
  )
}

export async function getStaticProps() {
  const loadProducts = async (order, limit) => {
    let products = null

    try {
      const res = await fetch(`${API_PROTO}://${API_HOST}${API_PREFIX}/products?&order=${order}&limit=${limit}`) // eslint-disable-line no-undef  
      const data = await res.json()

      products = data && data.data && data.data.products ? data.data.products : []
    } catch(err) {
      products = []
    }

    return products
  }

  const getCategories = async () => {
    let categories = null

    try {
      const res = await fetch(`${API_PROTO}://${API_HOST}${API_PREFIX}/categories`) // eslint-disable-line no-undef  
      const data = await res.json()

      categories = data && data.data && data.data.categories ? data.data.categories : []
    } catch(err) {
      categories = []
    }

    return categories
  }

  const order = 'asc'
  const limit = 6
  const myLoadProducts = loadProducts(order, limit)
  const loadCategories = getCategories({ fullUrl: true })

  const initData = await Promise.all([ myLoadProducts, loadCategories ]) // eslint-disable-line no-undef

  return {
    props: {
      initData: {
        "initProducts": initData[0],
        "initCategories": initData[1],
      }
    },
    revalidate: 60
  }  
}

export default ShopPage