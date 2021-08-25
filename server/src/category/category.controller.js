import NotFoundError from '../errors/NotFoundError.js'
import UnprocessableEntityError from '../errors/UnprocessableEntityError.js'

const categoryController = ({ categoryService }) => {
  const getCategoryById = async (req, res, next) => {
    const { id } = req.params
    let category = null
/*
    if(!id) {
      return next(new BadRequestError('invalid category id'))
    }
*/
    try {
      category = await categoryService.getCategoryById(id, { lean: true })
    } catch(err) {      
      return next(new NotFoundError('category not found', { err }))
    }

    if(!category) {
      return next(new NotFoundError('category not found'))
    }

    return res.status(200).json({
      data: {
        category
      }
    })
  }

  const getCategories = async (req, res, next) => {
    let categories = null

    try {
      categories = await categoryService.getCategories({}, { lean: true, sortBy: 'name' })
    } catch(err) {
      return next(new NotFoundError('categories not found', { err }))
    }

    if(!categories || (Array.isArray(categories) && categories.length === 0)) {
      return next(new NotFoundError('categories not found'))
    }

    return res.status(200).json({
      data: {
        categories
      }
    })
  }

  const createCategory = async (req, res, next) => {
    const { name } = req.body
    let newCategory = null

    try {
      newCategory = await categoryService.createCategory({ name })
    } catch(err) {
      return next(new UnprocessableEntityError('failed to create category', { err }))
    }

    res.status(201).json({
      data: {
        category: {
          _id: newCategory._id,
          name: newCategory.name
        }
      }
    })
  }

  const updateCategory = async (req, res, next) => {
    const { id } = req.params
    const { name } = req.body
    let updatedCategory = null
    const filterParams = { _id: id }
    const updateParams = { name }

    try {
      updatedCategory = await categoryService.updateCategory(filterParams, updateParams)
    } catch(err) {
      return next(new UnprocessableEntityError('failed to update category', { err }))
    }

    res.status(200).json({
      data: {
        category: {
          _id: updatedCategory._id,
          name: updatedCategory.name
        }
      }
    })
  }

  const deleteCategory = async (req, res, next) => {
    const { id } = req.params
    let result = null

    try {
      result = await categoryService.deleteCategory({  _id: id })
    } catch(err) {
      return next(new NotFoundError('failed to delete category'), { err })
    }
    
    if(!result || !(result && result.deletedCount !== 0)) {
      return next(new NotFoundError('failed to delete category'))
    }

    return res.status(204).end()
  }

  return {
    getCategoryById,
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory,
  }
}

export default categoryController