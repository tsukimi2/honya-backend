import Card from 'react-bootstrap/Card'
import ListGroup from 'react-bootstrap/ListGroup'

const UserInfo = ({ username, email, role }) => {
  return (
    <Card className="mb-5">
      <Card.Header>User Information</Card.Header>
      <ListGroup>
        <ListGroup.Item>{ username }</ListGroup.Item>
        <ListGroup.Item>{ email }</ListGroup.Item>
        <ListGroup.Item>{ role === 'admin' ? 'Admin' : 'Registered User' }</ListGroup.Item>
      </ListGroup>
    </Card>
  )
}

export default UserInfo