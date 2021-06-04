export const register = (req, res) => {
  if(!req || (req && !req.user)) {
    res.status(401).json({
      err: 'AuthErr',
      errmsg: 'User registration failed'
    })
  }

  const { username, email } = req.user

  res.status(200).json({
    message: 'Register successful',
    data: {
      user: {
        username,
        email
      }
    }
  })
}