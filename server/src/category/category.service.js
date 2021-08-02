const categoryService = ({ categoryRepos }) => {
  const createCategory = async (params) => {
    return categoryRepos.create(params)
  }

  return {
    createCategory
  }
}

export default categoryService