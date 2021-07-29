const categoryController = ({ categoryService, logger }) => {
  const createCategory = async (req, res, next) => {
    /*
    pi_1    | req user
    api_1    | undefined
    api_1    | req auth
    api_1    | { _id: '60ff830714681b0014b640a4' }
    */

//    const { _id: uid } = req.user  
    // console.log('auth')
    //console.log(req.auth)

    console.log('req user')
    console.log(req.user)
    console.log('req auth')
    console.log(req.auth)

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