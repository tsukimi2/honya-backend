import { useState, useEffect } from 'react'
import _ from 'lodash'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import CategoryFilter from '../search/CategoryFilter'
import PriceFilter from '../search/PriceFilter'
import { prices as priceIntervals } from '../../libs/constants/fixedPrice'
import { getFilteredProducts } from '../../libs/apiUtils/product-api-utils'
import { useCategories } from '../../libs/apiUtils/category-api-utils'
import DisplayProducts from '../product/DisplayProducts'

const transformCategoryDataToCategoryOpts = (data) => {
  if(data && Array.isArray(data)) {
    return data.map(elem => ({
      id: elem._id,
      label: elem.name,
      val: elem._id,
    }))
  }

  return []
}

const transformPriceIntervalsToProductOpts = (data) => {
  if(data && Array.isArray(data)) {
    return data.map(elem => ({
      id: elem._id,
      label: elem.name,
      val: elem.array,
    }))
  }

  return []
}

const handlePrice = value => {
  const data = priceIntervals;
  let array = [];

  for (let key in data) {
      if (data[key]._id === parseInt(value)) {
          array = data[key].array;
      }
  }
  return array;
}

const Shop = ({
  initCategories, initProducts
}) => {
  const { categories } = useCategories()
  const [prevCategories, setPrevCategories] = useState([])
  const categoryHeader = 'Filter by categories'
  const categoryGroupName = 'category'
  const priceHeader = 'Filter by price'
  const priceGroupName = 'price'
  const [categoryOpts, setCategoryOpts] = useState(initCategories && Array.isArray(initCategories) ? transformCategoryDataToCategoryOpts(initCategories) : [])
  const [priceOpts] = useState(priceIntervals && Array.isArray(priceIntervals) ? transformPriceIntervalsToProductOpts(priceIntervals) : [])
  const [myFilters, setMyFilters] = useState({
    filters: {
      category: [],
      price: []
    }
  })
  const [limit] = useState(6)
  const [order] = useState(1)
  const [skip, setSkip] = useState(0)
  const [size, setSize] = useState(0)
  const [filteredProducts, setFilteredProducts] = useState(initProducts)

  if(!(_.isEqual(categories, prevCategories))) {
    setPrevCategories([...categories])
    const transformedcategoryOpts = transformCategoryDataToCategoryOpts(categories)
    setCategoryOpts([...transformedcategoryOpts])
  }

  useEffect(() => {
    loadFilteredProducts(myFilters.filters)
  }, [myFilters])

  const loadMore = async () => {
    let toSkip = skip + limit
    try {
      const { products, size } = await getFilteredProducts({
        skip: toSkip,
        limit, order,
        filters: myFilters.filters
      })
      setFilteredProducts([...filteredProducts, ...products])
      setSize(size)
      setSkip(toSkip)
    } catch(err) {
      // do nothing
    }
  }

  const btnLoadMore = () => {
    return (
      size > 0 &&
      filteredProducts.length > 0 && 
      size > filteredProducts.length && (
        <Button onClick={loadMore} variant="warning" className="mb-5">
          Load more
        </Button>
      )
    )  
  }

  const loadFilteredProducts = async (newFilters) => {
    let filteredProducts = []
    setSkip(0)

    try {
      const { products, size } = await getFilteredProducts({
        skip: 0,
        limit, order,
        filters: newFilters
      })
      filteredProducts = products
      setSize(size)
    } catch(err) {
      filteredProducts = []
      setSize(0)
    }

    setFilteredProducts(filteredProducts)
  }

  const handleFilters = (filters, filterBy) => {
    const newFilters = { ...myFilters }
    newFilters.filters[filterBy] = filters

    if(filterBy === 'price') {
      const priceValues = handlePrice(filters)
      newFilters.filters[filterBy] = priceValues
    }

    loadFilteredProducts(newFilters.filters)
    setMyFilters(newFilters)
  }
/*
  return (
    <>
      <Container fluid className="mt-4">
        <Row>
        </Row>
      </Container>
    </>
  )
*/

  return(
    <>
      <Container fluid className="mt-4">
        <Row>
        <Col md={3}>
            <CategoryFilter
              header={categoryHeader}
              groupName={categoryGroupName}
              options={categoryOpts}
              handleFilters={handleFilters}
            />
            <PriceFilter
              header={priceHeader}
              groupName={priceGroupName}
              options={priceOpts}
              handleFilters={handleFilters}
            />
          </Col>
          <Col md={9}>
            <Container fluid>
                <Row>
                  <DisplayProducts
                    header="Products"
                    products={filteredProducts}
                  />
                  { btnLoadMore() }
              </Row>
            </Container>
          </Col>
        </Row>
      </Container>
    </>
  )
}

export default Shop