import Link from 'next/link'

const UserLinks = () => {
  return (
    <div className="card">
      <h4 className="card-header">User Links</h4>
      <ul className="list-group">
        <li className="list-group-item">
          <Link href="/cart">
            <a className="nav-link">My Cart</a>
          </Link>
        </li>
        <li className="list-group-item">
          <Link href="/profile/update">
            <a className="nav-link">Update Profile</a>
          </Link>
        </li>
      </ul>
    </div>
  )
}

export default UserLinks