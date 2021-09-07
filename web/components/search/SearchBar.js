import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import SearchForm from './SearchForm'

const SearchBar = ({ categories, handleChange, submitHandler }) => {
  return (
    <Row>
      <Container className="mb-3">
        <SearchForm
          categories={categories}
          handleChange={handleChange}
          submitHandler={submitHandler}
        />
      </Container>
    </Row>
  )
}

export default SearchBar
