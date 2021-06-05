import passport from 'passport'
import passportLocal from  'passport-local'
import DatabaseError from '../errors/DatabaseError.js'
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
          email
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