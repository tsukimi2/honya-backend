// eslint-disable-next-line react/display-name
const WithAdmin = (WrappedComponent) => (props) => {
  return <WrappedComponent {...props} />
}

export default WithAdmin