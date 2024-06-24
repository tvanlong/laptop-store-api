/* eslint-disable no-unused-vars */
import bcryptjs from 'bcryptjs'
import { DEFAULT_AVATAR } from '~/constants/defaultVariables'
import User from '~/models/user.model'
import { sendEmail } from '~/utils/email'
import { generateOTP } from '~/utils/generateOtp'
import { changeEmailValid, changePasswordValid, profileCustomerValid, userValid } from '~/validation/user.validation'

const getAllCustomers = async (req, res, next) => {
  try {
    const customers = await User.find({ role: 'member' })
    if (!customers || customers.length == 0) {
      return res.status(404).json({ message: 'Không tìm thấy khách hàng nào' })
    }

    return res.status(200).json({
      message: 'Lấy danh sách khách hàng thành công',
      data: customers
    })
  } catch (error) {
    next(error)
  }
}

const getCustomer = async (req, res, next) => {
  try {
    const { id } = req.params
    const customer = await User.findById(id)
    if (!customer) {
      return res.status(404).json({ message: 'Không tìm thấy khách hàng' })
    }

    return res.status(200).json({
      message: 'Lấy thông tin khách hàng thành công',
      data: customer
    })
  } catch (error) {
    next(error)
  }
}

const getAllStaffs = async (req, res, next) => {
  try {
    const staffs = await User.find({ role: 'staff' })
    if (!staffs || staffs.length == 0) {
      return res.status(404).json({ message: 'Không tìm thấy nhân viên nào' })
    }

    return res.status(200).json({
      message: 'Lấy danh sách nhân viên thành công',
      data: staffs
    })
  } catch (error) {
    next(error)
  }
}

const getStaff = async (req, res, next) => {
  try {
    const { id } = req.params
    const staff = await User.findById(id)
    if (!staff) {
      return res.status(404).json({ message: 'Không tìm thấy nhân viên' })
    }

    return res.status(200).json({
      message: 'Lấy thông tin nhân viên thành công',
      data: staff
    })
  } catch (error) {
    next(error)
  }
}

const createStaff = async (req, res, next) => {
  try {
    const { error } = userValid.validate(req.body, { abortEarly: false })
    if (error) {
      const errors = error.details.map((item) => item.message)
      return res.status(400).json({ errors })
    }
    const { email } = req.body
    const userExists = await User.findOne({ email })
    if (userExists) {
      return res.status(400).json({ message: 'Email đã tồn tại!' })
    }

    const hashedPassword = await bcryptjs.hash(req.body.password, 10)
    const staff = await User.create({ ...req.body, password: hashedPassword, role: 'staff', avatar: DEFAULT_AVATAR })
    const { password, ...userInfo } = staff._doc
    return res.status(201).json({
      message: 'Tạo nhân viên mới thành công',
      data: userInfo
    })
  } catch (error) {
    next(error)
  }
}

const updateProfile = async (req, res, next) => {
  try {
    const { error } = profileCustomerValid.validate(req.body, { abortEarly: false })
    if (error) {
      const errors = error.details.map((item) => item.message)
      return res.status(400).json({ errors })
    }

    const { id } = req.params
    const customer = await User.findById(id)
    if (!customer) {
      return res.status(404).json({ message: 'Không tìm thấy khách hàng' })
    }

    const { email } = req.body
    const userExists = await User.find({ email })
    if (userExists.length > 0) {
      userExists.forEach((user) => {
        if (user.email === email && user._id != id) {
          return res.status(400).json({ message: 'Email đã tồn tại!' })
        }
      })
    }

    const updatedCustomer = await User.findByIdAndUpdate(
      id,
      {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone
      },
      { new: true }
    )
    const { password, ...userInfo } = updatedCustomer._doc
    return res.status(200).json({
      message: 'Cập nhật thông tin khách hàng thành công',
      data: userInfo
    })
  } catch (error) {
    next(error)
  }
}

const changePassword = async (req, res, next) => {
  try {
    const { error } = changePasswordValid.validate(req.body, { abortEarly: false })
    if (error) {
      const errors = error.details.map((item) => item.message)
      return res.status(400).json({ errors })
    }

    const { id } = req.params
    const customer = await User.findById(id)
    if (!customer) {
      return res.status(404).json({ message: 'Không tìm thấy khách hàng' })
    }

    const { password } = req.body
    const isMatch = await bcryptjs.compare(password, customer.password)
    if (isMatch) {
      return res.status(400).json({ message: 'Mật khẩu mới không được trùng với mật khẩu cũ' })
    }

    const hashedPassword = await bcryptjs.hash(password, 10)
    await User.findByIdAndUpdate(id, { password: hashedPassword }, { new: true })
    return res.status(200).json({ message: 'Đổi mật khẩu thành công' })
  } catch (error) {
    next(error)
  }
}

const updateStaff = async (req, res, next) => {
  try {
    const { error } = userValid.validate(req.body, { abortEarly: false })
    if (error) {
      const errors = error.details.map((item) => item.message)
      return res.status(400).json({ errors })
    }

    const { id } = req.params
    const staff = await User.findById(id)
    if (!staff) {
      return res.status(404).json({ message: 'Không tìm thấy nhân viên' })
    }

    const { email } = req.body
    const userExists = await User.find({ email })
    if (userExists.length > 0) {
      userExists.forEach((user) => {
        if (user.email === email && user._id != id) {
          return res.status(400).json({ message: 'Email đã tồn tại!' })
        }
      })
    }

    const isMatch = await bcryptjs.compare(req.body.password, staff.password)
    if (isMatch) {
      return res.status(400).json({ message: 'Mật khẩu mới không được trùng với mật khẩu cũ' })
    }

    const hashedPassword = await bcryptjs.hash(req.body.password, 10)
    const updatedStaff = await User.findByIdAndUpdate(
      id,
      { ...req.body, password: hashedPassword, role: 'staff' },
      { new: true }
    )
    const { password, ...userInfo } = updatedStaff._doc
    return res.status(200).json({
      message: 'Cập nhật thông tin nhân viên thành công',
      data: userInfo
    })
  } catch (error) {
    next(error)
  }
}

const deleteStaff = async (req, res, next) => {
  try {
    const { id } = req.params
    const staff = await User.findById(id)
    if (!staff) {
      return res.status(404).json({ message: 'Không tìm thấy nhân viên' })
    }
    await User.findByIdAndDelete(id)
    return res.status(200).json({ message: 'Xóa nhân viên thành công' })
  } catch (error) {
    next(error)
  }
}

const changeEmail = async (req, res, next) => {
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
    const message = `Mã OTP của bạn là: ${otp}`
    await sendEmail(new_email, 'Xác nhận thay đổi email', message)
    res.cookie('otp', otp, { maxAge: 60000, httpOnly: true })
    return res.status(200).json({ message: 'Vui lòng kiểm tra email của bạn để xác nhận thay đổi email!' })
  } catch (error) {
    next(error)
  }
}

const verifyEmail = async (req, res, next) => {
  try {
    const { email, otp } = req.body
    const { id } = req.params
    const otpCookie = req.cookies.otp

    if (Number(otp) !== Number(otpCookie)) {
      return res.status(400).json({ message: 'Mã OTP không chính xác!' })
    }

    const user = await User.findByIdAndUpdate(id, { email }, { new: true })
    res.clearCookie('otp')
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
  getAllCustomers,
  getCustomer,
  getAllStaffs,
  getStaff,
  createStaff,
  updateProfile,
  changePassword,
  updateStaff,
  deleteStaff,
  changeEmail,
  verifyEmail
}
