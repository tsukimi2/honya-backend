const orderService = ({ orderRepos }) => {
  const createOrder = (params) => {
    return orderRepos.create(params)
  }

  return {
    createOrder,
  }
}

export default orderService