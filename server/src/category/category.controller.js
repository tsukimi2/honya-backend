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
      categories = await categoryService.getCategories({}, { lean: true })
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
        name: newCategory.name
      }
    })
  }

  return {
    getCategoryById,
    getCategories,
    createCategory
  }
}

export default categoryController