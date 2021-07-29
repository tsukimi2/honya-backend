const categoryService = ({ categoryRepos }) => {
  const createCategory = async (params) => {
    return categoryRepos.createCategory(params)
  }

  return {
    createCategory
  }
}

export default categoryService