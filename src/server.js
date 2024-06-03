/* eslint-disable no-console */
import chalk from 'chalk'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import session from 'express-session'
import helmet from 'helmet'
import { connect } from 'mongoose'
import passport from 'passport'
import { corsOptions } from '~/configs/cors'
import '~/configs/passport/facebook.passport'
import '~/configs/passport/google.passport'
import { errorHandlingMiddleware } from '~/middlewares/errorHandlingMiddleware'
import router from '~/routes'

const app = express()
app.use(cookieParser())

// MemoryStore for session storage (prevents memory leaks)
const MemoryStore = require('memorystore')(session)

// Load environment variables
dotenv.config()
const { APP_PORT, MONGO_ATLAS_URI } = process.env
// Connect to MongoDB
connect(MONGO_ATLAS_URI)

// Middleware
app.use(helmet())
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }))
app.use(cors(corsOptions)) // Enable CORS
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Session middleware: Required for OAuth 2.0
app.use(
  session({
    secret: 'secret',
    resave: false,
    store: new MemoryStore({ checkPeriod: 86400000 }),
    saveUninitialized: true,
    cookie: { secure: process.env.BUILD_MODE === 'prod' ? true : false } // Set to true if using HTTPS
  })
)

// Passport middleware
app.use(passport.initialize())
app.use(passport.session())

// Routes
app.use('/api', router)

// Middleware xử lý lỗi tập trung
app.use(errorHandlingMiddleware)

// Error handler
if (process.env.BUILD_MODE === 'prod') {
  // Production environment
  app.listen(process.env.PORT, () => {
    console.log(chalk.greenBright(`Production: Server is running at Port:${process.env.PORT}`))
  })
} else {
  // Development environment
  app.listen(APP_PORT, () => {
    console.log(chalk.greenBright(`Local Dev: Server is running at http://localhost:${APP_PORT}`))
  })
}
