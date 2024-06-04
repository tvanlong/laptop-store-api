/* eslint-disable no-unused-vars */
import bcryptjs from 'bcryptjs'
import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'
import { DEFAULT_AVATAR, DEFAULT_ROLE } from '~/constants/defaultVariables'
import User from '~/models/user.model'
import { loginSuccessService } from '~/services/auth.service'
import { sendEmail } from '~/utils/email'
import { generateAccessToken, generateRefreshToken } from '~/utils/generateToken'
import { clearCookieAdmin, clearCookieMember, setTokenIntoCookie } from '~/utils/utils'
import { signInValid, signUpValid } from '~/validation/user.validation'

dotenv.config()

const signUp = async (req, res, next) => {
  try {
    // 1. Validate dữ liệu nguời dùng
    const { error } = signUpValid.validate(req.body, { abortEarly: false })
    if (error) {
      const errors = error.details.map((item) => item.message)
      return res.status(400).json({ errors })
    }

    // 2. Kiểm tra xem email đã tồn tại chưa
    const { email } = req.body
    const userExists = await User.findOne({ email })
    if (userExists) {
      return res.status(400).json({ message: 'Email đã tồn tại!' })
    }

    // 3. Gửi email xác nhận tài khoản
    const userData = { ...req.body, role: DEFAULT_ROLE }
    const token = jwt.sign(userData, process.env.JWT_ACCOUNT_VERIFY, { expiresIn: '10m' })
    const message = `Vui lòng xác nhận email của bạn bằng cách nhấn vào đường link sau: ${
      process.env.BUILD_MODE === 'prod' ? process.env.URL_CLIENT_DEPLOY : process.env.URL_CLIENT
    }/register-success/${token}`
    await sendEmail(email, 'Xác nhận tài khoản', message)

    return res.status(200).json({ message: 'Vui lòng kiểm tra email của bạn để xác nhận tài khoản!' })
  } catch (error) {
    next(error)
  }
}

const verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.params

    if (!token) {
      return res.status(400).json({ message: 'Token không hợp lệ!' })
    }

    jwt.verify(token, process.env.JWT_ACCOUNT_VERIFY, async (error, user) => {
      if (error) {
        return res.status(403).json({ message: 'Token không hợp lệ!' })
      }
      const hashedPassword = await bcryptjs.hash(user.password, 10)
      const newUser = await User.create({
        ...user,
        avatar: DEFAULT_AVATAR,
        password: hashedPassword
      })
      const { password, ...userInfo } = newUser._doc
      return res.status(201).json({
        message: 'Đăng ký thành công!',
        data: userInfo
      })
    })
  } catch (error) {
    next(error)
  }
}

const signIn = async (req, res, next) => {
  try {
    // 1. Validate dữ liệu nguời dùng
    const { error } = signInValid.validate(req.body, { abortEarly: false })
    if (error) {
      const errors = error.details.map((item) => item.message)
      return res.status(400).json({ errors })
    }

    // 2. Kiểm tra xem email đã tồn tại chưa
    const { email } = req.body
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(404).json({ message: 'Email không tồn tại!' })
    }

    // 3. Tìm người dùng theo email và kiểm tra mật khẩu
    const isMatch = await bcryptjs.compare(req.body.password, user.password)
    if (!isMatch) {
      return res.status(400).json({ message: 'Mật khẩu không chính xác!' })
    }

    // 4. Tạo JWT
    const payload = { _id: user._id, email: user.email, role: user.role }
    const accessToken = generateAccessToken(payload)
    const refreshToken = generateRefreshToken(payload)

    // 5. Gửi token trong cookie
    setTokenIntoCookie(res, accessToken, refreshToken, user)

    // 6. Trả về thông tin người dùng đã đăng nhập và token
    const { password, ...userInfo } = user._doc
    return res.status(200).json({
      message: 'Đăng nhập thành công!',
      data: { ...userInfo },
      access_token: 'Bearer ' + accessToken,
      refresh_token: 'Bearer ' + refreshToken
    })
  } catch (error) {
    next(error)
  }
}

const signOutAdmin = async (req, res, next) => {
  try {
    clearCookieAdmin(res)
    return res.status(200).json({ message: 'Đăng xuất thành công!' })
  } catch (error) {
    next(error)
  }
}

const signOutMember = async (req, res, next) => {
  try {
    clearCookieMember(res)
    return res.status(200).json({ message: 'Đăng xuất thành công!' })
  } catch (error) {
    next(error)
  }
}

const refreshToken = async (req, res, next) => {
  try {
    let refreshToken
    // Kiểm tra domain của yêu cầu
    const origin = req.headers.origin || req.headers.referer
    if (origin === process.env.URL_CLIENT || origin === process.env.URL_CLIENT_DEPLOY) {
      refreshToken = req.cookies.refresh_token_member
    } else if (origin === process.env.URL_ADMIN || origin === process.env.URL_ADMIN_DEPLOY) {
      refreshToken = req.cookies.refresh_token_admin
    }

    if (!refreshToken) {
      return res.status(401).json({ message: 'Bạn chưa đăng nhập!' })
    }

    jwt.verify(refreshToken, process.env.JWT_REFRESH_TOKEN, (error, user) => {
      if (error) {
        return res.status(403).json({ message: 'Token không hợp lệ!' })
      }

      const payload = { _id: user._id, email: user.email, role: user.role }
      const newAccessToken = generateAccessToken(payload)
      const newRefreshToken = generateRefreshToken(payload)
      setTokenIntoCookie(res, newAccessToken, newRefreshToken, user)

      return res.status(200).json({
        message: 'Làm mới token thành công!',
        access_token: 'Bearer ' + newAccessToken,
        refresh_token: 'Bearer ' + newRefreshToken
      })
    })
  } catch (error) {
    next(error)
  }
}

const loginSuccess = async (req, res, next) => {
  try {
    const { userId } = req.body
    if (!userId) {
      return res.status(400).json({ message: 'Không tìm thấy userId' })
    }
    const response = await loginSuccessService(userId, res)
    return res.status(200).json(response)
  } catch (error) {
    next(error)
  }
}

export default {
  signUp,
  verifyEmail,
  signIn,
  signOutAdmin,
  signOutMember,
  refreshToken,
  loginSuccess
}
