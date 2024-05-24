import FacebookStrategy from 'passport-facebook'
import User from '~/models/user.model'
import passport from 'passport'
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()
const { FACEBOOK_APP_ID, FACEBOOK_APP_SECRET, URL_API_DEPLOY } = process.env
const DEFAULT_PASSWORD = '123123123'
const DEFAULT_PHONE = '0384823130'

// Facebook Strategy
passport.use(
  new FacebookStrategy(
    {
      clientID: FACEBOOK_APP_ID,
      clientSecret: FACEBOOK_APP_SECRET,
      callbackURL:
        process.env.BUILD_MODE === 'prod'
          ? `${URL_API_DEPLOY}/api/auth/facebook/callback`
          : 'http://localhost:3000/api/auth/facebook/callback',
      profileFields: ['id', 'displayName', 'email']
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const existingUser = await User.findOne({ email: profile.emails[0].value })
        if (existingUser) {
          return done(null, existingUser)
        } else {
          const hashedPassword = await bcrypt.hash(DEFAULT_PASSWORD, 10)
          const newUser = new User({
            email: profile.emails[0].value,
            name: profile.displayName,
            phone: DEFAULT_PHONE,
            password: hashedPassword
          })
          const savedUser = await newUser.save()
          done(null, savedUser)
        }
      } catch (err) {
        done(err, null)
      }
    }
  )
)

// Serialize and deserialize user instance
passport.serializeUser((user, done) => {
  done(null, user.id)
})

passport.deserializeUser((id, done) => {
  User.findById(id).then((user) => {
    done(null, user)
  })
})
