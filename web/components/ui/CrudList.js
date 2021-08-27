import PropTypes from 'prop-types'
import ListGroup from 'react-bootstrap/ListGroup'
import CrudListItem from './CrudListItem'
import styles from './CrudList.module.css'

const CrudList = ({ list, removeListItem, updateListItem }) => {
  return (
    <ListGroup className={styles.list}>
      {
        list.length > 0 && list.map(elem => (
          <CrudListItem
            key={elem._id}
            listItemId={elem._id}
            initListItemTxt={elem.name}
            removeListItem={removeListItem}
            updateListItem={updateListItem}
          />
        ))
      }
    </ListGroup>
  )
}

CrudList.propTypes = {
  list: PropTypes.arrayOf(PropTypes.object).isRequired,
  removeListItem: PropTypes.func.isRequired,
  updateListItem: PropTypes.func.isRequired,
}

export default CrudList