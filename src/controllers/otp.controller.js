/* eslint-disable no-unused-vars */
import OTPs from '~/models/otp.model'
import User from '~/models/user.model'
import { sendEmail } from '~/utils/email'
import { generateOTP } from '~/utils/generateOtp'
import { changeEmailValid } from '~/validation/user.validation'

const sendOTPToChangeEmail = async (req, res, next) => {
  try {
    const { error } = changeEmailValid.validate(req.body, {
      abortEarly: false
    })
    if (error) {
      const errors = error.details.map((item) => item.message)
      return res.status(400).json({ errors })
    }

    const { id } = req.params
    const user = await User.findById(id)
    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng' })
    }

    const { new_email } = req.body
    const userExists = await User.find({ new_email })
    if (userExists.length > 0) {
      userExists.forEach((user) => {
        if (user.email === new_email && user._id != id) {
          return res.status(400).json({ message: 'Email đã tồn tại!' })
        }
      })
    }

    const otp = generateOTP()
    const newOTP = new OTPs({ email: new_email, otp })
    await newOTP.save()

    const message = `Mã OTP của bạn là: ${otp}`
    await sendEmail(new_email, 'Xác nhận thay đổi email', message)
    return res.status(200).json({ message: 'Vui lòng kiểm tra email của bạn để xác nhận thay đổi email!' })
  } catch (error) {
    next(error)
  }
}

const verifyOTPToChangeEmail = async (req, res, next) => {
  try {
    const { email, otp } = req.body
    const { id } = req.params
    const existingOTP = await OTPs.findOneAndDelete({ email, otp })
    if (!existingOTP) {
      return res.status(400).json({ message: 'Mã OTP không hợp lệ' })
    }

    const user = await User.findByIdAndUpdate(id, { email }, { new: true })
    const { password, ...userInfo } = user._doc
    return res.status(200).json({
      message: 'Cập nhật email thành công',
      data: userInfo
    })
  } catch (error) {
    next(error)
  }
}

export default {
  sendOTPToChangeEmail,
  verifyOTPToChangeEmail
}
