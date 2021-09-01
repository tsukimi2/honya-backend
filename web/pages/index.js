import { useState, useEffect } from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import { useProducts } from '../libs/apiUtils/product-api-utils'
import LoadingOverlay from '../components/ui/LoadingOverlay'
import { API_HOST, API_PREFIX } from '../config'
import DisplayProducts from '../components/product/DisplayProducts'


export default function Home({ initProducts }) {
  const [productsByArrival, setProductsByArrival] = useState(initProducts.iniitProductsByArrival)
  const [productsBySell, setProductsBySell] = useState(initProducts.iniitProductsBySell)

  const { products: arrProductsByArrival, isLoading: isLoadingProductsByArrival } = useProducts('createdAt', 'desc', 6)
  const { products: arrProductsBySell, isLoading: isLoadingProductsBySell } = useProducts('sold', 'desc', 6)

  useEffect(() => { 
    if(arrProductsByArrival && Array.isArray(arrProductsByArrival)) {    
      setProductsByArrival(arrProductsByArrival.slice())
    }

    if(arrProductsBySell && Array.isArray(arrProductsBySell)) {
      setProductsBySell(arrProductsBySell.slice())
    }
  }, [arrProductsByArrival, arrProductsBySell])


  return (
    <>
      {
        (isLoadingProductsByArrival || isLoadingProductsBySell) && (<LoadingOverlay />)
      }
      <Container fluid className="mt-4">
        <Row>
          <DisplayProducts
            header="New Arrivals"
            products={productsByArrival}
          />
        </Row>
        <hr />
        <Row>
          <DisplayProducts
            header="Best Sellers"
            products={productsBySell}
          />
        </Row>
      </Container>
    </>
  )
}

export async function getStaticProps() {
  const loadProducts = async (sortBy, order, limit) => {
    let products = null

    try {
      const res = await fetch(`http://${API_HOST}${API_PREFIX}/products?sortBy=${sortBy}&order=${order}&limit=${limit}`) // eslint-disable-line no-undef  
      const data = await res.json()

      products = data && data.data && data.data.products ? data.data.products : []  
    } catch(err) {
      products = []
    }

    return products
  }

  const order = 'desc'
  const limit = 6
  const loadProductsByArrival = loadProducts('createdAt', order, limit)
  const loadProductsBySell = loadProducts('createdAt', order, limit)

  const initProducts = await Promise.all([ loadProductsByArrival, loadProductsBySell ]) // eslint-disable-line no-undef

  return {
    props: {
      initProducts: {
        "initProductsByArrival": initProducts[0],
        "initProductsBySell": initProducts[1],
      }
    },
    revalidate: 60
  }
}