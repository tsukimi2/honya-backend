import Link from 'next/link'
import Card from 'react-bootstrap/Card'
import ListGroup from 'react-bootstrap/ListGroup'
import Nav from 'react-bootstrap/Nav'

const arrAdminLinks = [
  { link: '/admin/category', text: 'Create Category' },
  { link: '/admin/product/create', text: 'Create Product' },
  { link: '/admin/orders', text: 'View Orders' },
  { link: '/admin/products', text: 'Manage Products' }
]

const AdminLinks = () => {
  return (
    <Card>
      <Card.Header>Admin Links</Card.Header>
      {
        arrAdminLinks.map(elem => {
          return (
            <ListGroup.Item key={elem.link}>
              <Link href={elem.link} passHref>
                <Nav.Link>{elem.text}</Nav.Link>
              </Link>
            </ListGroup.Item>
          )
        })
      }
    </Card>
  )
}

export default AdminLinks