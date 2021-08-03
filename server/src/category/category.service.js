const categoryService = ({ categoryRepos }) => {
  const getCategoryById = async (id, opts={}) => {
    return categoryRepos.getById(id, opts)
  }

  const getCategories = async (filterParams, opts={}) => {
    return categoryRepos.get(filterParams, opts)
  }

  const createCategory = async (params) => {
    return categoryRepos.create(params)
  }

  return {
    getCategoryById,
    getCategories,
    createCategory
  }
}

export default categoryService