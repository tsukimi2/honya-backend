import Alert from 'react-bootstrap/Alert'

const ShowAlert = ({ children, alertLevel }) => {
  return (
    <Alert variant={alertLevel}>
      {children}
    </Alert>
  )
}

export default ShowAlert