import Form from 'react-bootstrap/Form'
import InputGroup from 'react-bootstrap/InputGroup'
import Button from 'react-bootstrap/Button'

const SearchForm = ({ categories, handleChange, submitHandler }) => {
  return (
    <Form onSubmit={submitHandler}>
      <InputGroup className="mb-3">
        <div className="input-group-prepend">
          <select
              className="btn mr-2"
              onChange={handleChange("category")}
          > 
            <option value="All">All Categories</option>
            {
              categories.map(elem => (
                <option key={elem._id} value={elem._id}>{elem.name}</option>
              ))
            }
          </select>
        </div>

        <Form.Control
          type="search"
          placeholder="Search by name"
          aria-label="Search by name"
          onChange={handleChange("search")}
        />
        <Button type="submit" variant="outline-primary">
          Seach
        </Button>
      </InputGroup>
    </Form>
  )
}

export default SearchForm


/*


    */