const categoryController = ({ categoryService, logger }) => {
  const createCategory = async (req, res, next) => {
    const { name } = req.body
    let newCategory = null

    try {
      newCategory = await categoryService.createCategory({ name })
    } catch(err) {
      return next(err)
    }

    res.status(200).json({
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