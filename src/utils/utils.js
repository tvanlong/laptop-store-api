import dotenv from 'dotenv'
dotenv.config()

export const setTokenIntoCookie = (res, accessToken, refreshToken) => {
  if (process.env.BUILD_MODE === 'prod') {
    res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 7 * 24 * 60 * 60 * 1000
    })
    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 30 * 24 * 60 * 60 * 1000
    })
  } else {
    res.cookie('access_token', accessToken, { httpOnly: false, maxAge: 7 * 24 * 60 * 60 * 1000 }) // Thời gian sống: 7 ngày
    res.cookie('refresh_token', refreshToken, { httpOnly: false, maxAge: 30 * 24 * 60 * 60 * 1000 }) // Thời gian sống: 30 ngày
  }
}

export const clearCookie = (res) => {
  res.clearCookie('access_token')
  res.clearCookie('refresh_token')
  res.clearCookie('user')
}
