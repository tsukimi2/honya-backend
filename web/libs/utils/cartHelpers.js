import { localStorage_get, localStorage_set, localStorage_remove } from "./localStorage-utils"

// export const addItemToCart = (item, next) => {
export const addItemToCart = (item) => {
  let cart = []

  const cartFromLocalStorage = localStorage_get('cart')
  if(cartFromLocalStorage) {
    cart = cartFromLocalStorage
  }
  cart.push({
    ...item,
    count: 1
  })

  // remove duplicates
  // build an Array from new Set and turn it back into array using Array.from
  // so that later we can re-map it
  // new set will only allow unique values in it
  // so pass the ids of each object/product
  // If the loop tries to add the same value again, it'll get ignored
  // ...with the array of ids we got on when first map() was used
  // run map() on it again and return the actual product from the cart
  cart = Array.from(new Set(cart.map(p => p._id))).map(id => {
    return cart.find(p => p._id === id);
  })

  localStorage_set('cart', cart)
}

export const getNumItemsInCart = () => {
  const cart = localStorage_get('cart')
  if(!cart || !Array.isArray(cart)) {
    return 0
  }

  return cart.reduce((acc, currElem) => acc + currElem.count, 0)
}

export const getCart = () => {
  const cart = localStorage_get('cart')
  if(!cart) {
    return []
  }

  return cart
}

export const updateItemInCart = (productId, count) => {
  const cart = localStorage_get('cart')
  if(!cart) {
    return false
  }

  cart.map((product, i) => {
    if (product._id === productId) {
        cart[i].count = count;
    }
  })

  localStorage_set('cart', cart)

  return true
}

export const removeItemInCart = productId => {
  const cart = localStorage_get('cart')
  if(!cart) {
    return []
  }

  cart.map((product, i) => {
    if (product._id === productId) {
      cart.splice(i, 1);
    }
  })
  localStorage_set('cart', cart)

  return cart
}

export const emptyCart = () => {
  localStorage_remove('cart')
}
