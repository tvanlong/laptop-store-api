import jwt from 'jsonwebtoken'

export const generateAccessToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_ACCESS_TOKEN, { expiresIn: '7d' })
}

export const generateRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_REFRESH_TOKEN, { expiresIn: '30d' })
}
