// eslint-disable-next-line react/display-name
const WithAuth = (WrappedComponent) => (props) => {
  return <WrappedComponent {...props} />
}

export default WithAuth