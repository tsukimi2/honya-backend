import { useState, useEffect } from 'react'
import { useProducts } from '../libs/apiUtils/product-api-utils'
import { API_PROTO, API_HOST, API_PREFIX } from '../config'
import HomeComponent from '../components/product/Home'


export default function Home({ initProducts }) {
  const [productsByArrival, setProductsByArrival] = useState(initProducts.iniitProductsByArrival)
  const [productsBySell, setProductsBySell] = useState(initProducts.iniitProductsBySell)
  const { products: arrProductsByArrival, isLoading: isLoadingProductsByArrival } = useProducts({ sortBy: 'createdAt', order: 'desc', limit: 6}, true)
  const { products: arrProductsBySell, isLoading: isLoadingProductsBySell } = useProducts({ sortBy: 'sold', order: 'desc', limit: 6 }, true)

  useEffect(() => { 
    if(arrProductsByArrival && Array.isArray(arrProductsByArrival)) {       
      setProductsByArrival(arrProductsByArrival.slice())
    }

    if(arrProductsBySell && Array.isArray(arrProductsBySell)) {  
      setProductsBySell(arrProductsBySell.slice())
    }
  }, [arrProductsByArrival, arrProductsBySell])

  useEffect(() => {

  }, [isLoadingProductsByArrival])

  return (
    <HomeComponent 
      isLoadingProductsByArrival={isLoadingProductsByArrival}
      isLoadingProductsBySell={isLoadingProductsBySell}
      productsByArrival={productsByArrival}
      productsBySell={productsBySell}
    />
  )
}

export async function getStaticProps() {
  const loadProducts = async (sortBy, order, limit) => {
    let products = null

    try {
      const res = await fetch(`${API_PROTO}://${API_HOST}${API_PREFIX}/products?sortBy=${sortBy}&order=${order}&limit=${limit}`) // eslint-disable-line no-undef  
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