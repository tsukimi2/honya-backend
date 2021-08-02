import Category from '../../src/category/category.model.js'

export const generateCategoryParams = ({ profile='basic', optParams={}}) => {
  let initParams = {
    name: 'category1',
  }

  if(profile === 'empty') {
    initParams = {
      name: '',
    }
  }

  return Object.assign({}, initParams, optParams)
}

export const generateCategory = async ({ profile='basic', optParams={}}) => {
  const params = generateCategoryParams({ profile, optParams })

  let doc = null
  try {
    doc = new Category(params)
    await doc.save()
  } catch(err) {
    console.log(err)
  }

  return doc
}