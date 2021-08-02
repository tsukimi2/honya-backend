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