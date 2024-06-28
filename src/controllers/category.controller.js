import Category from '~/models/category.model'
import { categoryValid } from '~/validation/category.validation'

const getAllCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().populate('subcategories')
    if (!categories || categories.length == 0) {
      return res.status(404).json({ message: 'Không tìm thấy danh mục nào' })
    }

    return res.status(200).json({
      message: 'Lấy danh sách danh mục thành công',
      data: categories
    })
  } catch (error) {
    next(error)
  }
}

const getCategoryById = async (req, res, next) => {
  try {
    const { id } = req.params
    const category = await Category.findById(id)
    if (!category) {
      return res.status(404).json({ message: 'Không tìm thấy danh mục này' })
    }

    return res.status(200).json({
      message: 'Lấy danh mục thành công',
      data: category
    })
  } catch (error) {
    next(error)
  }
}

const createCategory = async (req, res, next) => {
  try {
    const { error } = categoryValid.validate(req.body, { abortEarly: false })
    if (error) {
      const errors = error.details.map((item) => item.message)
      return res.status(400).json({ errors })
    }

    // Chuẩn hóa tên sản phẩm trước khi kiểm tra
    const normalizedCategoryName = req.body.name.toLowerCase()
    // Kiểm tra sự tồn tại của sản phẩm (bao gồm cả viết hoa và viết thường)
    const existedCategory = await Category.findOne({
      name: { $regex: new RegExp('^' + normalizedCategoryName + '$', 'i') }
    })
    if (existedCategory) {
      return res.status(400).json({ message: 'Danh mục này đã tồn tại' })
    }

    const category = await Category.create(req.body)
    if (!category) {
      return res.status(400).json({ message: 'Tạo danh mục không thành công' })
    }

    return res.status(201).json({
      message: 'Tạo danh mục thành công',
      data: category
    })
  } catch (error) {
    next(error)
  }
}

const updateCategory = async (req, res, next) => {
  try {
    const { error } = categoryValid.validate(req.body, { abortEarly: false })
    if (error) {
      const errors = error.details.map((item) => item.message)
      return res.status(400).json({ errors })
    }

    // Chuẩn hóa tên sản phẩm trước khi kiểm tra
    const normalizedCategoryName = req.body.name.toLowerCase()
    // Kiểm tra sự tồn tại của sản phẩm (bao gồm cả viết hoa và viết thường)
    const existedCategory = await Category.findOne({
      name: { $regex: new RegExp('^' + normalizedCategoryName + '$', 'i') }
    })
    if (existedCategory && existedCategory._id != req.params.id) {
      return res.status(400).json({ message: 'Danh mục này đã tồn tại' })
    }

    const { id } = req.params
    const category = await Category.findByIdAndUpdate(id, req.body, { new: true })
    if (!category) {
      return res.status(404).json({ message: 'Không tìm thấy danh mục này' })
    }

    return res.status(200).json({
      message: 'Cập nhật danh mục thành công',
      data: category
    })
  } catch (error) {
    next(error)
  }
}

const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id)
    if (!category) {
      return res.status(404).json({ message: 'Không tìm thấy danh mục này' })
    }

    return res.status(200).json({ message: 'Xóa danh mục thành công' })
  } catch (error) {
    next(error)
  }
}

export default {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
}
