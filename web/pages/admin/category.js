import { Container } from "react-bootstrap"
import Category from "../../components/category/Category"
import { API_HOST, API_PREFIX } from "../../config"

const CategoryPage = ({ initCategories }) => {
  return (
    <Container md={{ span: 8, offset: 2 }}>
      <Category initCategories={initCategories} />
    </Container>
  )
}

export async function getStaticProps() {
  const res = await fetch(`http://${API_HOST}${API_PREFIX}/categories`) // eslint-disable-line no-undef
  const data = await res.json()
  const initCategories = data && data.data && data.data.categories ? data.data.categories : []

  return {
    props: {
      initCategories
    }
  }
}

export default CategoryPage