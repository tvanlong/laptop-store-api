import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import User from '~/models/user.model'
import passport from 'passport'
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()
const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, URL_API_DEPLOY } = process.env
const DEFAULT_PASSWORD = '123123123'
const DEFAULT_PHONE = '0384823130'

// Google Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL:
        process.env.BUILD_MODE === 'prod'
          ? `${URL_API_DEPLOY}/api/auth/google/callback`
          : 'http://localhost:3000/api/auth/google/callback',
      passReqToCallback: true
    },
    async (request, accessToken, refreshToken, profile, done) => {
      try {
        const existingUser = await User.findOne({ email: profile.emails[0].value })
        if (existingUser) {
          return done(null, existingUser)
        } else {
          const hashedPassword = await bcrypt.hash(DEFAULT_PASSWORD, 10)
          const newUser = new User({
            email: profile.emails[0].value,
            name: `${profile.name.familyName} ${profile.name.givenName}`,
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
