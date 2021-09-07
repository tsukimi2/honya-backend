export const cartReducer = (state, action) => {
  switch(action.type) {
    case 'SET_ITEMS_COUNT':
      return action.count
    default:
      return state
  }
}