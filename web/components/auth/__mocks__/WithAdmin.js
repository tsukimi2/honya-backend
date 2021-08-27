const WithAdmin = (WrappedComponent) => (props) => {
  return <WrappedComponent {...props} />
}

export default WithAdmin