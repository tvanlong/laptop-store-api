import dotenv from 'dotenv'
dotenv.config()

export const setTokenIntoCookie = (res, accessToken, refreshToken, user) => {
  const isProd = process.env.BUILD_MODE === 'prod'
  console.log('process.env.BUILD_MODE: ', process.env.BUILD_MODE)
  console.log('isProd: ', isProd)
  const cookieOptions = {
    httpOnly: isProd,
    maxAge: 7 * 24 * 60 * 60 * 1000
  }

  if (isProd) {
    cookieOptions.secure = true
    cookieOptions.sameSite = 'none'
  }

  if (user.role === 'admin') {
    console.log('In setTokenIntoCookie: ', user.role)
    res.cookie('access_token_admin', accessToken, cookieOptions)
    res.cookie('refresh_token_admin', refreshToken, { ...cookieOptions, maxAge: 30 * 24 * 60 * 60 * 1000 })
  } else if (user.role === 'member') {
    console.log('In setTokenIntoCookie: ', user.role)
    res.cookie('access_token_member', accessToken, cookieOptions)
    res.cookie('refresh_token_member', refreshToken, { ...cookieOptions, maxAge: 30 * 24 * 60 * 60 * 1000 })
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
