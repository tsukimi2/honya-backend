import PropTypes from 'prop-types'
import Card from 'react-bootstrap/Card'
import CrudForm from './CrudForm'
import CrudList from './CrudList'
import styles from './CrudListBox.module.css'

const CrudListBox = ({
  listBoxName, list, frmLabelName, frmInputPlaceholder, frmSubmitBtnTxt, ishorizontalFrm, frmSubmitHandler, removeListItem, updateListItem
}) => {
  return (
    <Card className={styles.well}>
      <Card.Body>
        <Card.Title className="mb-4 mt-2"><h3>{listBoxName}</h3></Card.Title>
        <CrudList
          list={list}
          removeListItem={removeListItem}
          updateListItem={updateListItem}
        />
        <div className="mt-4"></div>
        <CrudForm
          frmSubmitHandler={frmSubmitHandler}
          frmLabelName={frmLabelName}
          frmInputPlaceholder={frmInputPlaceholder}
          frmSubmitBtnTxt={frmSubmitBtnTxt}
          ishorizontalFrm={ishorizontalFrm}
        />
      </Card.Body>
    </Card>
  )
}

CrudListBox.propTypes = {
  listBoxName: PropTypes.string.isRequired,
  list: PropTypes.arrayOf(PropTypes.object)
}

export default CrudListBox

