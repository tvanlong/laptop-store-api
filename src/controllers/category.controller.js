import Category from '~/models/category.model.js'
import { categoryValid } from '~/validation/category.validation.js'

export const getAllCategories = async (req, res) => {
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
    return res.status(500).json({
      name: error.name,
      message: error.message
    })
  }
}

export const getCategoryById = async (req, res) => {
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
    return res.status(500).json({
      name: error.name,
      message: error.message
    })
  }
}

export const createCategory = async (req, res) => {
  try {
    const { error } = categoryValid.validate(req.body, { abortEarly: false })
    if (error) {
      const errors = error.details.map((item) => item.message)
      return res.status(400).json({ errors })
    }

    const { name } = req.body
    const existedCategory = await Category.findOne({ name })
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
    return res.status(500).json({
      name: error.name,
      message: error.message
    })
  }
}

export const updateCategory = async (req, res) => {
  try {
    const { error } = categoryValid.validate(req.body, { abortEarly: false })
    if (error) {
      const errors = error.details.map((item) => item.message)
      return res.status(400).json({ errors })
    }

    const { name } = req.body
    const existedCategory = await Category.findOne({ name })
    if (existedCategory) {
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
    return res.status(500).json({
      name: error.name,
      message: error.message
    })
  }
}

export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id)
    if (!category) {
      return res.status(404).json({ message: 'Không tìm thấy danh mục này' })
    }

    return res.status(200).json({ message: 'Xóa danh mục thành công' })
  } catch (error) {
    return res.status(500).json({
      name: error.name,
      message: error.message
    })
  }
}
