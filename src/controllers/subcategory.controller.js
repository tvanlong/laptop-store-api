import Subcategory from '~/models/subcategory.model.js'
import { subcategoryValid } from '~/validation/subcategory.validation.js'
import Category from '~/models/category.model.js'

export const getAllSubcategories = async (req, res) => {
  try {
    const subcategories = await Subcategory.find({}).populate('category')
    if (!subcategories || subcategories.length == 0) {
      return res.status(404).json({ message: 'Không tìm thấy danh mục nào' })
    }

    return res.status(200).json({
      message: 'Lấy danh sách danh mục thành công',
      data: subcategories
    })
  } catch (error) {
    return res.status(500).json({
      name: error.name,
      message: error.message
    })
  }
}

export const getSubcategoryById = async (req, res) => {
  try {
    const { id } = req.params
    const subcategory = await Subcategory.findById(id).populate('category')
    if (!subcategory) {
      return res.status(404).json({ message: 'Không tìm thấy danh mục này' })
    }

    return res.status(200).json({
      message: 'Lấy danh mục thành công',
      data: subcategory
    })
  } catch (error) {
    return res.status(500).json({
      name: error.name,
      message: error.message
    })
  }
}

export const createSubcategory = async (req, res) => {
  try {
    const { error } = subcategoryValid.validate(req.body, { abortEarly: false })
    if (error) {
      const errors = error.details.map((item) => item.message)
      return res.status(400).json({ errors })
    }

    const { name } = req.body
    const existedSubcategory = await Subcategory.findOne({ name })
    if (existedSubcategory) {
      return res.status(400).json({ message: 'Danh mục này đã tồn tại' })
    }

    const subcategory = await Subcategory.create(req.body)
    if (!subcategory) {
      return res.status(400).json({ message: 'Tạo danh mục không thành công' })
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      subcategory.category,
      {
        $addToSet: { subcategories: subcategory._id }
      },
      { new: true }
    )

    if (!updatedCategory) {
      return res.status(400).json({ message: 'Cập nhật danh mục không thành công' })
    }

    return res.status(201).json({
      message: 'Tạo danh mục thành công',
      data: subcategory
    })
  } catch (error) {
    return res.status(500).json({
      name: error.name,
      message: error.message
    })
  }
}

export const updateSubcategory = async (req, res) => {
  try {
    const { error } = subcategoryValid.validate(req.body, { abortEarly: false })
    if (error) {
      const errors = error.details.map((item) => item.message)
      return res.status(400).json({ errors })
    }

    const { id } = req.params
    const subcategoryExists = await Subcategory.findById(id)
    if (!subcategoryExists) {
      return res.status(404).json({ message: 'Không tìm thấy danh mục này' })
    }

    const { name } = req.body
    const existedSubcategory = await Subcategory.findOne({ name })
    if (existedSubcategory && existedSubcategory._id != id) {
      return res.status(400).json({ message: 'Danh mục này đã tồn tại' })
    }

    // Kiểm tra xem danh mục sản phẩm có thay đổi không
    if (req.body.category !== subcategoryExists.category) {
      const oldCategory = await Category.findByIdAndUpdate(subcategoryExists.category, {
        $pull: { subcategories: id }
      })
      if (!oldCategory) {
        return res.status(400).json({ message: 'Cập nhật danh mục không thành công!' })
      }

      const newCategory = await Category.findByIdAndUpdate(req.body.category, { $push: { subcategories: id } })
      if (!newCategory) {
        return res.status(400).json({ message: 'Cập nhật danh mục không thành công!' })
      }
    }

    const subcategory = await Subcategory.findByIdAndUpdate(id, req.body, { new: true })
    if (!subcategory) {
      return res.status(404).json({ message: 'Không tìm thấy danh mục này' })
    }

    return res.status(200).json({
      message: 'Cập nhật danh mục thành công',
      data: subcategory
    })
  } catch (error) {
    return res.status(500).json({
      name: error.name,
      message: error.message
    })
  }
}

export const deleteSubcategory = async (req, res) => {
  try {
    const subcategory = await Subcategory.findByIdAndDelete(req.params.id)
    if (!subcategory) {
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
