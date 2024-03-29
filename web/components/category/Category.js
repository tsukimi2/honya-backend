import { useState, useEffect } from 'react'
import Container from 'react-bootstrap/Container'
import { ToastContainer, toast } from 'react-toastify'
import CrudListBox from "../ui/CrudListBox"
import { getCategories, createCategory, updateCategory, deleteCategory } from '../../libs/apiUtils/category-api-utils'
import WithAuth from '../auth/WithAuth'
import WithAdmin from '../auth/WithAdmin'
import * as Yup from 'yup'
import PropTypes from 'prop-types'

const addCategoryValidationSchema = {
  name: Yup.string()
    .required('Required')
    .min(3, 'Must be between 3 and 20 characters')
    .max(20, 'Must be between 3 and 20 characters')
    .matches(/^[a-zA-Z0-9_ -]+$/, {
      excludeEmptyString: true,
      message: 'Only alphanumeric characters and - and _'
    })
    .trim()
}

const Category = ({ initCategories }) => {
  const listBoxName = 'Categories'
  const frmLabelName = 'Category Name'
  const frmInputPlaceholder = 'Add category'
  const frmSubmitBtnTxt = 'Add Category'
  const ishorizontalFrm = "true"

  const [categories, setCategories] = useState(initCategories)

  const loadCategories = async () => {
    let data = []
    try {
      const result = await getCategories({})
      data = result.data.categories
    } catch(err) {
      data = []
    }

    setCategories(data)
    return data
  }

  useEffect(() => {
    loadCategories()

    // https://stackoverflow.com/questions/54954385/react-useeffect-causing-cant-perform-a-react-state-update-on-an-unmounted-comp
    return () => {
      setCategories([])
    }
  }, [])

  const addCategory = async (newCategory) => {    
    try {
      const { category } = await createCategory(newCategory)
      setCategories([ ...categories, category ])
      toast.success(`Add category ${newCategory.name} successful`, {
        toastId: 'addCategorySuccessToastId',
      })
      return true
    } catch(err) {
      toast.error(`Add category ${newCategory.name} failed`, {
        toastId: 'addCategoryFailToastId',
      })
    }

    return false
  }

  const editCategory = async (id, name) => {
    try {
      await updateCategory(id, name)
      const updatedCategories = categories.map(elem => {
        if(elem._id === id) {
          return {
            _id: id,
            name
          }
        }

        return elem
      })

      setCategories(updatedCategories)
      toast.success(`Add category ${name} successful`, {
        toastId: 'updateCategorySuccessToastId',
      })
      return true
    } catch(err) {
      toast.error(`Add category ${name} failed`, {
        toastId: 'updateCategoryFailToastId',
      })
    }

    return false
  } 

  const removeCategory = async (categoryId, name) => {
    try {
      await deleteCategory(categoryId)
      const data = categories
      const filteredData = data.filter(elem => elem._id !== categoryId)
      setCategories(filteredData)
      toast.success(`Remove category ${name} successful`, {
        toastId: 'removeCategorySuccessToastId',
      })
    } catch(err) {
      toast.error(`Remove category  ${name} failed`, {
        toastId: 'removeCategoryFailToastId',
      }) 
    }
  }

  return (
    <Container className="mt-4">
      <CrudListBox
        className="mt-4"
        listBoxName={listBoxName}
        list={categories}
        frmLabelName={frmLabelName}
        frmInputPlaceholder={frmInputPlaceholder}
        frmSubmitBtnTxt={frmSubmitBtnTxt}
        crudFormvalidationSchema={addCategoryValidationSchema}
        ishorizontalFrm={ishorizontalFrm}
        frmSubmitHandler={addCategory}
        removeListItem={removeCategory}
        updateListItem={editCategory}
      />
      <ToastContainer
        position="bottom-center"
        autoClose={false}
        limit={1}
        hideProgressBar
        draggable={false}
      />
    </Container>
  )
}

Category.propTypes = {
  initCategories: PropTypes.arrayOf(PropTypes.object)
}

export default WithAuth(WithAdmin(Category))
