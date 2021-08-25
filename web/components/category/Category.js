import { useState, useEffect } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import CrudListBox from "../ui/CrudListBox"
import { getCategories, createCategory, updateCategory, deleteCategory } from '../../libs/apiUtils/category-api-utils'
import WithAuth from '../auth/WitAuth'
import WithAdmin from '../auth/WithAdmin'

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
      const result = await getCategories()
      data = result.data.categories
    } catch(err) {
      data = []
    }

    setCategories(data)
  }

  useEffect(() => {
    loadCategories()
  }, [])

  const addCategory = async (newCategory) => {
    try {
      const { category } = await createCategory(newCategory)
      setCategories([ ...categories, category ])
      toast.success(`Add category ${newCategory} successful`, {
        toastId: 'addCategorySuccessToastId',
      })
      return true
    } catch(err) {
      toast.error(`Add category ${newCategory} failed`, {
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
    <>
      <CrudListBox
        listBoxName={listBoxName}
        list={categories}
        frmLabelName={frmLabelName}
        frmInputPlaceholder={frmInputPlaceholder}
        frmSubmitBtnTxt={frmSubmitBtnTxt}
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
    </>
  )
}
//
export default WithAuth(WithAdmin(Category))
