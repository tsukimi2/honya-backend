import { useState } from 'react'
import PropTypes from 'prop-types'
import swal from '@sweetalert/with-react'
import ListGroup from 'react-bootstrap/ListGroup'
import { FiEdit2 } from 'react-icons/fi'
import Button from 'react-bootstrap/Button'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import Form from 'react-bootstrap/Form'
import styles from './CrudListItem.module.css'

const CrudListItem = ({ listItemId, initListItemTxt, removeListItem, updateListItem }) => {
  const [editMode, setEditMode] = useState(false)
  const [listItemTxt, setListItemTxt] = useState(initListItemTxt)

  const onRemoveNode = (e) => {
    e.preventDefault()
    swal({
      title: "Are you sure?",
      text: `Do you want to delete item ${listItemTxt}`,
      icon: "warning",
      buttons: true,
      dangerMode: true,
    })
    .then((willDelete) => {
      if (willDelete) {
        removeListItem(listItemId, listItemTxt)
      }
    })

    return
  }

  const onEditNode = (e) => {
    e.preventDefault()
    setEditMode(true)
    return
  }

  const saveEdit = async () => {
    const result = await updateListItem(listItemId, listItemTxt)
    if(!result) {
      setListItemTxt(initListItemTxt)
    }
    setEditMode(false)
  }

  const cancelEdit = () => {
    setEditMode(false)
  }

  const handleChange = (e) => {
    setListItemTxt(e.target.value)
  }
//                &#xff38;
  return (
    <ListGroup.Item className={styles.listItem}>
    {
      !editMode && (
        <>
          <span className={styles.listItemTxt}>{listItemTxt}</span>
          <div className={styles.floatEnd}>
            <ButtonGroup className={styles.btnGroup}>
              <Button variant="info" className={styles.btn} onClick={onEditNode}>
                <FiEdit2 />
              </Button>
              <Button variant="danger" className={styles.btn} onClick={onRemoveNode}>X</Button>
            </ButtonGroup>
          </div>
        </>
      )
    }
    {
      editMode && (
        <>
          <Form.Control
            type="text"
            onChange={handleChange}
            className={styles.listItemTxt}
            value={listItemTxt}
          />
          <div className={styles.floatEnd}>
            <ButtonGroup className={styles.btnGroup}>
              <Button variant="success" className={styles.btn} onClick={saveEdit}>
                Save
              </Button>
              <Button variant="danger" className={styles.btn} onClick={cancelEdit}>
                Cancel
              </Button>
            </ButtonGroup>
          </div>
        </>
      )
    }
    </ListGroup.Item>
  )
}

CrudListItem.propTypes = {
  initListItemTxt: PropTypes.string.isRequired
}

export default CrudListItem