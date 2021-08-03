import mongoose from 'mongoose'
import Product from '../../src/product/product.model.js'

export const generateProductParams = ({ productProfile='basic', optParams={}}) => {
  let initProductParams = {
    name: 'product1',
    description: 'product description',
    category: 'category1',
    price: 0,
  }

  if(productProfile === 'empty') {
    initProductParams = {
      name: '',
      category: '',
    }
  } else if(productProfile === 'full') {
    initProductParams['quantity'] = 0
    initProductParams['sold'] = 2
    initProductParams['shipping'] = false
  }

  return Object.assign({}, initProductParams, optParams)
}

export const generateProduct = async ({ productProfile='basic', optParams={}}) => {
  let productParams = generateProductParams({ productProfile, optParams })
  productParams['category'] = mongoose.Types.ObjectId()

  let product = null
  try {
    product = new Product(productParams)
    await product.save()
  } catch(err) {
    console.log(err)
  }

  return product
}