import UnprocessableEntityError from '../errors/UnprocessableEntityError.js'

const categoryController = ({ categoryService }) => {
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
    createCategory
  }
}

export default categoryController