const categoryService = ({ categoryRepos }) => {
  const getCategoryById = async (id, opts={}) => {
    return categoryRepos.getById(id, opts)
  }

  const createCategory = async (params) => {
    return categoryRepos.create(params)
  }

  return {
    getCategoryById,
    createCategory
  }
}

export default categoryService