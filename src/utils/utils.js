import dotenv from 'dotenv'
dotenv.config()

export const setTokenIntoCookie = (res, accessToken, refreshToken, user) => {
  const isProd = process.env.BUILD_MODE === 'prod'
  const cookieOptions = {
    httpOnly: isProd,
    maxAge: 7 * 24 * 60 * 60 * 1000
  }

  if (isProd) {
    cookieOptions.secure = true
    cookieOptions.sameSite = 'none'
  }

  let cookieName = ''
  if (user.role === 'admin') {
    cookieName = 'access_token_admin'
  } else if (user.role === 'member') {
    cookieName = 'access_token_member'
  }

  if (cookieName) {
    res.cookie(cookieName, accessToken, cookieOptions)
    res.cookie('refresh_token', refreshToken, { ...cookieOptions, maxAge: 30 * 24 * 60 * 60 * 1000 })
  }
}

export const clearCookieAdmin = (res) => {
  res.clearCookie('access_token_admin')
  res.clearCookie('refresh_token_admin')
}

export const clearCookieMember = (res) => {
  res.clearCookie('access_token_member')
  res.clearCookie('refresh_token_member')
}
