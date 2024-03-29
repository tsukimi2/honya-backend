import { useState } from 'react'
import LoadingOverlay from "../ui/LoadingOverlay"
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import SearchBar from "../search/SearchBar"
import DisplayProducts from "./DisplayProducts"
import { useCategories } from '../../libs/apiUtils/category-api-utils'
import { getProducts } from '../../libs/apiUtils/product-api-utils'

const Home = ({ isLoadingProductsByArrival, isLoadingProductsBySell, productsByArrival, productsBySell }) => {
  const { categories } = useCategories()

  const [searchData, setSearchData] = useState({
    category: "",
    search: "",
    products: [],
    searched: false
  })

  const { category, search, products, searched } = searchData
  
  const handleSearchBarChange = name => evt => {    
    setSearchData({ ...searchData, [name]: evt.target.value })
  }

  const searchProducts = async () => {
    if(search) {
      try {
        const searchedProducts = await getProducts({
          search: search || undefined,
          category,
        })
        setSearchData({ ...searchData, products: searchedProducts, searched: true  })
      } catch(err) {
        // eslint-disable-line
      }
    }
  }

  const searchBarSubmitHandler = (e) => {
    e.preventDefault()
    searchProducts()
  }

  const renderDisplayProducts = () => {
    if(searched) {
      if(products && Array.isArray(products) && products.length > 0) {
        return (
          <Row>
            <DisplayProducts
              header={`${products.length} products found`}
              products={products}
            />
          </Row> 
        )
      } else {
        return (<h2>No products found</h2>)
      }
    }
  }

  return (
    <>
      {
        (isLoadingProductsByArrival || isLoadingProductsBySell) && (<LoadingOverlay />)
      }
      <Container fluid className="mt-4">
        <SearchBar
          categories={categories}
          handleChange={handleSearchBarChange}
          submitHandler={searchBarSubmitHandler}
        />
        { renderDisplayProducts() }
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

export default Home