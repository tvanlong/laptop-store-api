export const setTokenIntoCookie = (res, accessToken, refreshToken) => {
  res.cookie('access_token', accessToken, { httpOnly: false, maxAge: 7 * 24 * 60 * 60 * 1000 }) // Thời gian sống: 7 ngày
  res.cookie('refresh_token', refreshToken, { httpOnly: false, maxAge: 30 * 24 * 60 * 60 * 1000 }) // Thời gian sống: 30 ngày
}

export const clearCookie = (res) => {
  res.clearCookie('access_token')
  res.clearCookie('refresh_token')
  res.clearCookie('user')
}
