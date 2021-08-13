import Link from 'next/link'

const AdminLinks = () => {
  return (
    <div className="card">
      <h4 className="card-header">Admin Links</h4>
      <ul className="list-group">
        <li className="list-group-item">
          <Link href="/create/category">
            <a className="nav-link">Create Category</a>
          </Link>
        </li>
        <li className="list-group-item">
          <Link href="/create/product">
            <a className="nav-link">Create Product</a>
          </Link>
        </li>
        <li className="list-group-item">
          <Link href="/admin/orders">
            <a className="nav-link">View Orders</a>
          </Link>
        </li>
        <li className="list-group-item">
          <Link href="/admin/products">
            <a className="nav-link">Manage Products</a>
          </Link>
        </li>
      </ul>
    </div>
  )
}

export default AdminLinks