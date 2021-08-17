import Link from 'next/link'
import Card from 'react-bootstrap/Card'
import ListGroup from 'react-bootstrap/ListGroup'
import Nav from 'react-bootstrap/Nav'

const UserLinks = () => {
  return (
    <Card>
      <Card.Header>User Links</Card.Header>
      <ListGroup>
        <ListGroup.Item>
          <Link href="/cart" passHref>
            <Nav.Link>My Cart</Nav.Link>
          </Link>
        </ListGroup.Item>
        <ListGroup.Item>
          <Link href="/profile/update" passHref>
            <Nav.Link>Update Profile</Nav.Link>
          </Link>
        </ListGroup.Item>
      </ListGroup>
    </Card>
  )
}

export default UserLinks