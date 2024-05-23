/* eslint-disable no-unused-vars */
import User from '~/models/user.model.js'
import { generateAccessToken, generateRefreshToken } from '~/utils/generateToken.js'
import { setTokenIntoCookie } from '~/utils/utils.js'

export const loginSuccessService = async (userId, res) => {
  try {
    const userExists = await User.findOne({ _id: userId })
    const payload = { _id: userExists._id, email: userExists.email, role: userExists.role }
    const accessToken = generateAccessToken(payload)
    const refreshToken = generateRefreshToken(payload)
    setTokenIntoCookie(res, accessToken, refreshToken)
    const { password, ...userInfo } = userExists._doc
    return {
      message: 'Đăng nhập thành công!',
      data: { ...userInfo },
      access_token: 'Bearer ' + accessToken,
      refresh_token: 'Bearer ' + refreshToken
    }
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}
