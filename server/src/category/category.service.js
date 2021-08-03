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

  const updateCategory = async (filterParams, updateParams) => {    
    return categoryRepos.updateOne(filterParams, updateParams)
  }

  const deleteCategory = async (params) => {
    return categoryRepos.deleteOne(params)
  }

  return {
    getCategoryById,
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory,
  }
}

export default categoryService