import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import chalk from 'chalk'
import helmet from 'helmet'
import { connect } from 'mongoose'
import dotenv from 'dotenv'
import passport from 'passport'
import session from 'express-session'
import './configs/passport/google.passport.js'
import './configs/passport/facebook.passport.js'
import router from './routes/index.js'

const app = express()
app.use(cookieParser())

// Load environment variables
dotenv.config()
const { PORT, MONGO_ATLAS_URI, URL_CLIENT, URL_ADMIN } = process.env

// Connect to MongoDB
connect(MONGO_ATLAS_URI)

// Middleware
app.use(helmet())
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }))
app.use(cors({ origin: [URL_ADMIN, URL_CLIENT], credentials: true }))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Session middleware: Required for OAuth 2.0
app.use(
  session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using HTTPS
  })
)

// Passport middleware
app.use(passport.initialize())
app.use(passport.session())

// Routes
app.use('/api', router)

// Error handler
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(chalk.greenBright(`Server is running at http://localhost:${PORT}`))
})
