const UserInfo = ({ username, email, role }) => {


  return (
    <div className="card mb-5">
      <h3 className="card-header">User Information</h3>
      <ul className="list-group">
          <li className="list-group-item">{ username }</li>
          <li className="list-group-item">{ email }</li>
          <li className="list-group-item">{ role === 'admin' ? 'Admin' : 'Registered User' }</li>
      </ul>
    </div>
  )
}

export default UserInfo