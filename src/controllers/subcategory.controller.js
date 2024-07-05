import Category from '~/models/category.model'
import Subcategory from '~/models/subcategory.model'
import subcategoryService from '~/services/subcategory.service'
import { subcategoryValid } from '~/validation/subcategory.validation'

const getAllSubcategories = async (req, res, next) => {
  try {
    const { sort, order, keyword } = req.query
    const searchQuery = subcategoryService.getSearchQuery(keyword)
    const sortOptions = subcategoryService.getSortOptions(sort, order)

    const subcategories = await Subcategory.find(searchQuery).populate('category').sort(sortOptions)
    if (!subcategories || subcategories.length == 0) {
      return res.status(404).json({ message: 'Không tìm thấy danh mục nào' })
    }

    return res.status(200).json({
      message: 'Lấy danh sách danh mục thành công',
      data: subcategories
    })
  } catch (error) {
    next(error)
  }
}

const getSubcategoryById = async (req, res, next) => {
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
    next(error)
  }
}

const createSubcategory = async (req, res, next) => {
  try {
    const { error } = subcategoryValid.validate(req.body, { abortEarly: false })
    if (error) {
      const errors = error.details.map((item) => item.message)
      return res.status(400).json({ errors })
    }

    // Chuẩn hóa tên sản phẩm trước khi kiểm tra
    const normalizedSubcategoryName = req.body.name.toLowerCase()
    // Kiểm tra sự tồn tại của sản phẩm (bao gồm cả viết hoa và viết thường)
    const existedSubcategory = await Subcategory.findOne({
      name: { $regex: new RegExp('^' + normalizedSubcategoryName + '$', 'i') }
    })
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
    next(error)
  }
}

const updateSubcategory = async (req, res, next) => {
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
    next(error)
  }
}

const deleteSubcategory = async (req, res, next) => {
  try {
    const subcategory = await Subcategory.findByIdAndDelete(req.params.id)
    if (!subcategory) {
      return res.status(404).json({ message: 'Không tìm thấy danh mục này' })
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      subcategory.category,
      { $pull: { subcategories: subcategory._id } },
      { new: true }
    )
    if (!updatedCategory) {
      return res.status(400).json({ message: 'Xóa danh mục không thành công' })
    }

    return res.status(200).json({ message: 'Xóa danh mục thành công' })
  } catch (error) {
    next(error)
  }
}

export default {
  getAllSubcategories,
  getSubcategoryById,
  createSubcategory,
  updateSubcategory,
  deleteSubcategory
}
