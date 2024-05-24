/* eslint-disable no-unused-vars */
import User from '~/models/user.model'
import { generateAccessToken, generateRefreshToken } from '~/utils/generateToken'
import { setTokenIntoCookie } from '~/utils/utils'

export const loginSuccessService = async (userId, res, next) => {
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
    next(error)
  }
}
