/* eslint-disable no-console */
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import chalk from 'chalk'
import helmet from 'helmet'
import { connect } from 'mongoose'
import dotenv from 'dotenv'
import passport from 'passport'
import session from 'express-session'
import '~/configs/passport/google.passport.js'
import '~/configs/passport/facebook.passport.js'
import router from '~/routes/index.js'
import { errorHandlingMiddleware } from '~/middlewares/errorHandlingMiddleware'
import { corsOptions } from '~/configs/cors'

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
app.use(cors(corsOptions))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Session middleware: Required for OAuth 2.0
app.use(
  session({
    secret: 'secret',
    resave: false,
    store: new MemoryStore({ checkPeriod: 86400000 }),
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using HTTPS
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
