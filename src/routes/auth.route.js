import { Router } from 'express'
import passport from 'passport'
import { signUp, signIn, signOut, refreshToken, loginSuccess, verifyEmail } from '~/controllers/auth.controller.js'

const routerAuth = Router()
const { URL_CLIENT, URL_CLIENT_DEPLOY } = process.env

routerAuth.post('/signup', signUp)
routerAuth.post('/signin', signIn)
routerAuth.post('/signout', signOut)
routerAuth.post('/verify/:token', verifyEmail)
routerAuth.post('/refresh-token', refreshToken)
routerAuth.post('/signin-success', loginSuccess)

// ============================================ Google OAuth 2.0 ================================================
routerAuth.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email']
  })
)
routerAuth.get('/google/callback', passport.authenticate('google', { failureRedirect: '/' }), (req, res) => {
  res.redirect(`${process.env.BUILD_MODE === 'prod' ? URL_CLIENT_DEPLOY : URL_CLIENT}/login-success/${req.user._id}`)
})

// =========================================== Facebook OAuth 2.0 ===============================================
routerAuth.get(
  '/facebook',
  passport.authenticate('facebook', {
    scope: ['email']
  })
)

routerAuth.get('/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/' }), (req, res) => {
  res.redirect(`${process.env.BUILD_MODE === 'prod' ? URL_CLIENT_DEPLOY : URL_CLIENT}/login-success/${req.user._id}`)
})
// =============================================================================================================

export default routerAuth
