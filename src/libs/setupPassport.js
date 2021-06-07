import passport from 'passport'
import passportLocal from  'passport-local'
import bcrypt from 'bcrypt'
import DatabaseError from '../errors/DatabaseError.js'
import UnauthorizedError from '../errors/UnauthorizedError.js'
import User from '../user/user.model.js'

/*
passport.serializeUser(function(user, next) {
  next(null, user.id)
})

passport.deserializeUser(function(id, done) { 
    db.findById(id, function(err, user) {
    done(err, user);
    });
});
*/

const localStrategy = passportLocal.Strategy
passport.use(
  'register',
  new localStrategy(
    {
      usernameField: 'username',
      passwordField: 'password',
      passReqToCallback: true
    },
    async (req, username, password, next) => {
      const email = req.body.email

      try {
        const user = await User.create({
          username,
          password,
          email,
        })

        return next(null, user)
      } catch(err) {
        next(new DatabaseError('Failed to create user', {
          err,
        }))
      }
    }
  )
)

passport.use(
  'login',
  new localStrategy(
    {
      usernameField: 'username',
      passwordField: 'password',
    },
    async (username, password, next) => {
      try {
        // find user
        const user = await User.findOne({ username })
        if(!user) {
          // return next(null, false, { message: 'Invalid username/password' })
          return next(new UnauthorizedError('Invalid username/password'))
        }

        // validate password
        const hasValidPassword = await user.isValidPassword(password)
        if(!hasValidPassword) {
          // return next(null, false, { message: 'Invalid username/password' })
          return next(new UnauthorizedError('Invalid username/password'))
        }

        return next(null, user)
      } catch(err) {
        return next(new DatabaseError('Log in error', {
          err
        }))
      }
    }
  )
)