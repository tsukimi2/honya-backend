import PropTypes from 'prop-types'
import Card from 'react-bootstrap/Card'
import CrudForm from './CrudForm'
import CrudList from './CrudList'
import styles from './CrudListBox.module.css'

const CrudListBox = ({
  listBoxName, list, frmLabelName, frmInputPlaceholder, frmSubmitBtnTxt, crudFormvalidationSchema,
  ishorizontalFrm, frmSubmitHandler, removeListItem, updateListItem
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
          crudFormvalidationSchema={crudFormvalidationSchema}
          ishorizontalFrm={ishorizontalFrm}
        />
      </Card.Body>
    </Card>
  )
}

CrudListBox.propTypes = {
  listBoxName: PropTypes.string.isRequired,
  list: PropTypes.arrayOf(PropTypes.object).isRequired,
  frmLabelName: PropTypes.string.isRequired,
  frmInputPlaceholder: PropTypes.string,
  frmSubmitBtnTxt: PropTypes.string,
  crudFormvalidationSchema: PropTypes.object.isRequired,
  ishorizontalFrm: PropTypes.oneOf([ 'true', 'false' ]),
  frmSubmitHandler: PropTypes.func.isRequired,
  removeListItem: PropTypes.func.isRequired,
  updateListItem: PropTypes.func.isRequired,
}

CrudListBox.defaultProps = {
  frmInputPlaceholder: '',
  frmSubmitBtnTxt: 'Submit',
  ishorizontalFrm: 'false'
}

export default CrudListBox

