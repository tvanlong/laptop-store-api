/* eslint-disable no-unused-vars */
import User from '~/models/user.model.js'
import { userValid } from '~/validation/user.validation.js'
import bcryptjs from 'bcryptjs'

export const getAllCustomers = async (req, res) => {
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
    return res.status(500).json({
      name: error.name,
      message: error.message
    })
  }
}

export const getAllStaffs = async (req, res) => {
  try {
    const staffs = await User.find({ role: 'admin' })
    if (!staffs || staffs.length == 0) {
      return res.status(404).json({ message: 'Không tìm thấy nhân viên nào' })
    }

    return res.status(200).json({
      message: 'Lấy danh sách nhân viên thành công',
      data: staffs
    })
  } catch (error) {
    return res.status(500).json({
      name: error.name,
      message: error.message
    })
  }
}

export const getStaff = async (req, res) => {
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
    return res.status(500).json({
      name: error.name,
      message: error.message
    })
  }
}

export const createStaff = async (req, res) => {
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
    const staff = await User.create({ ...req.body, password: hashedPassword, role: 'admin' })
    const { password, ...userInfo } = staff._doc
    return res.status(201).json({
      message: 'Tạo nhân viên mới thành công',
      data: userInfo
    })
  } catch (error) {
    return res.status(500).json({
      name: error.name,
      message: error.message
    })
  }
}

export const updateStaff = async (req, res) => {
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

    if (req.body.password === staff.password) {
      // TH: không thay đổi mật khẩu (Mã hóa mật khẩu không thay đổi)
      const updatedStaff = await User.findByIdAndUpdate(
        id,
        {
          name: req.body.name,
          email: req.body.email,
          phone: req.body.phone,
          role: 'admin'
        },
        { new: true }
      )
      const { password, ...userInfo } = updatedStaff._doc
      return res.status(200).json({
        message: 'Cập nhật thông tin nhân viên thành công',
        data: userInfo
      })
    }

    const hashedPassword = await bcryptjs.hash(req.body.password, 10)
    const updatedStaff = await User.findByIdAndUpdate(
      id,
      { ...req.body, password: hashedPassword, role: 'admin' },
      { new: true }
    )
    const { password, ...userInfo } = updatedStaff._doc
    return res.status(200).json({
      message: 'Cập nhật thông tin nhân viên thành công',
      data: userInfo
    })
  } catch (error) {
    return res.status(500).json({
      name: error.name,
      message: error.message
    })
  }
}

export const deleteStaff = async (req, res) => {
  try {
    const { id } = req.params
    const staff = await User.findById(id)
    if (!staff) {
      return res.status(404).json({ message: 'Không tìm thấy nhân viên' })
    }
    await User.findByIdAndDelete(id)
    return res.status(200).json({ message: 'Xóa nhân viên thành công' })
  } catch (error) {
    return res.status(500).json({
      name: error.name,
      message: error.message
    })
  }
}
