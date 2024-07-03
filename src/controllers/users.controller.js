/* eslint-disable no-unused-vars */
import bcryptjs from 'bcryptjs'
import { DEFAULT_AVATAR } from '~/constants/defaultVariables'
import User from '~/models/user.model'
import userService from '~/services/user.service'
import { changePasswordValid, profileCustomerValid, userValid } from '~/validation/user.validation'

const getAllCustomers = async (req, res, next) => {
  try {
    const { sort, order, keyword } = req.query
    const searchQuery = userService.getSearchQuery(keyword)
    const sortOptions = userService.getSortOptions(sort, order)

    const customers = await User.find({ role: 'member', ...searchQuery }).sort(sortOptions)
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
    const { sort, order, keyword } = req.query
    const searchQuery = userService.getSearchQuery(keyword)
    const sortOptions = userService.getSortOptions(sort, order)

    const staffs = await User.find({ role: 'staff', ...searchQuery }).sort(sortOptions)
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

const softDeleteStaff = async (req, res, next) => {
  try {
    const { id } = req.params
    const staff = await User.findById(id)
    if (!staff) {
      return res.status(404).json({ message: 'Không tìm thấy nhân viên' })
    }

    await User.delete({ _id: id })
    return res.status(200).json({ message: 'Xóa nhân viên thành công' })
  } catch (error) {
    next(error)
  }
}

const getListDeletedStaffs = async (req, res, next) => {
  try {
    const staffs = await User.findWithDeleted({ role: 'staff', deleted: true })
    return res.status(200).json({
      message: 'Lấy danh sách nhân viên đã xóa thành công',
      data: staffs || []
    })
  } catch (error) {
    next(error)
  }
}

const restoreDeletedStaff = async (req, res, next) => {
  try {
    const { id } = req.params
    const staff = await User.findOneDeleted({ _id: id })
    if (!staff) {
      return res.status(404).json({ message: 'Không tìm thấy nhân viên' })
    }

    await User.restore({ _id: id })
    return res.status(200).json({ message: 'Khôi phục nhân viên thành công' })
  } catch (error) {
    next(error)
  }
}

const deleteStaff = async (req, res, next) => {
  try {
    const { id } = req.params
    const staff = await User.findOneDeleted({ _id: id })
    if (!staff) {
      return res.status(404).json({ message: 'Không tìm thấy nhân viên' })
    }
    await User.deleteOne({ _id: id })
    return res.status(200).json({ message: 'Xóa nhân viên thành công' })
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
  softDeleteStaff,
  getListDeletedStaffs,
  restoreDeletedStaff,
  deleteStaff
}
