const WithAuth = (WrappedComponent) => (props) => {
  return <WrappedComponent {...props} />
}

export default WithAuth