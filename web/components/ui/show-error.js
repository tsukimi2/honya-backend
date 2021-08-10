const ShowError = ({children}) => {
  return (
    <div className="alert alert-danger">
      {children}
    </div>
  )
}

export default ShowError