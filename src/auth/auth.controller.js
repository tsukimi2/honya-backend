import UnauthorizedError from '../errors/UnauthorizedError.js'

export const register = (req, res) => {
  // validationResult(req).throw();

  if(!req || (req && !req.user)) {
    console.log('Error in auth.controll.er.js register')
    console.log('Missing user profile in request')
    throw new UnauthorizedError('User registration failed')
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