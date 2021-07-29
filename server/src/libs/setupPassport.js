import passport from 'passport'
import passportLocal from  'passport-local'
import GoogleStratgey from 'passport-google-oauth20'
import DatabaseError from '../errors/DatabaseError.js'
import UnauthorizedError from '../errors/UnauthorizedError.js'
import config from '../libs/config/index.js'
import { userService } from '../di-container.js'

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

passport.serializeUser(function(user, next) {
  next(null, user)
})

passport.deserializeUser(function(user, next) {
  next(null, user)
})

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
      let userParams = {
        username,
        password,
        email,        
      }
      if(req.body.role) {
        userParams['role'] = req.body.role
      }

      try {
        const user = await userService.createUser(userParams)

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
        const user = await userService.getUser({ username })
        if(!user) {
          return next(new UnauthorizedError('Invalid username/password'))
        }

        // validate password
        const hasValidPassword = await user.isValidPassword(password)
        if(!hasValidPassword) {
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

passport.use(new GoogleStratgey({
  clientID: config.get('GOOGLE_OAUTH_CLIENT_ID'),
  clientSecret: config.get('GOOGLE_OAUTH_CLIENT_SECRET'),
  callbackURL: config.get('GOOGLE_OAUTH_CALLBACK_URL'),
}, async (accessToken, refreshToken, profile, cb) => {
  return cb(null, await userService.getOneOrCreateByGoogleDetails(profile.id, profile.emails[0].value))
}))
