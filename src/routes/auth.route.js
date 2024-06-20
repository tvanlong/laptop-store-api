import { Router } from 'express'
import passport from 'passport'
import authController from '~/controllers/auth.controller'
import { checkPermission } from '~/middlewares/checkPermission'

const routerAuth = Router()
const { URL_CLIENT, URL_CLIENT_DEPLOY } = process.env

routerAuth.post('/signup', authController.signUp)
routerAuth.post('/signin', authController.signIn)
routerAuth.patch('/forgot-password', authController.forgotPassword)
routerAuth.post('/signout-admin', checkPermission('admin'), authController.signOutAdmin)
routerAuth.post('/signout-member', checkPermission('member'), authController.signOutMember)
routerAuth.post('/verify/:token', authController.verifyEmail)
routerAuth.post('/refresh-token', authController.refreshToken)
routerAuth.post('/signin-success', authController.loginSuccess)

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
