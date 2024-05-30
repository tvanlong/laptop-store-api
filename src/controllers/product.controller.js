import Subcategory from '~/models/subcategory.model'
import Product from '~/models/product.model'
import { productValid } from '~/validation/product.validation'

export const getAllProducts = async (req, res, next) => {
  try {
    const { page, limit, sort, order, keyword } = req.query
    const options = {
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 10,
      populate: {
        path: 'subcategory',
        select: 'name'
      }
    }

    let sortQuery = {}
    if (sort && order) {
      if (sort === 'createdAt') {
        sortQuery[sort] = order === 'new' ? -1 : 1
      }
    }

    const filter = keyword ? { name: { $regex: keyword, $options: 'i' } } : {}

    const products = await Product.paginate(filter, { ...options, sort: sortQuery })

    if (products.totalDocs === 0) {
      return res.status(200).json({
        message: 'Không tìm thấy sản phẩm nào!',
        data: []
      })
    }

    return res.status(200).json({
      message: 'Lấy sản phẩm thành công!',
      data: products
    })
  } catch (error) {
    next(error)
  }
}

export const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params
    const product = await Product.findById(id)
      .populate({
        path: 'subcategory',
        select: 'name'
      })
      .populate('versions')
    if (!product) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm!' })
    }
    return res.status(200).json({
      message: 'Lấy sản phẩm thành công!',
      data: product
    })
  } catch (error) {
    next(error)
  }
}

export const createProduct = async (req, res, next) => {
  try {
    const { error } = productValid.validate(req.body)
    if (error) {
      const errors = error.details.map((item) => item.message)
      return res.status(400).json({ errors })
    }

    const existedProduct = await Product.findOne({ name: req.body.name })
    if (existedProduct) return res.status(400).json({ message: 'Sản phẩm này đã tồn tại!' })

    const product = await Product.create(req.body)
    if (!product) return res.status(400).json({ message: 'Tạo sản phẩm không thành công!' })

    // Cập nhật danh mục mà liên quan đến sản phẩm mới tạo
    const updatedSubcategory = await Subcategory.findByIdAndUpdate(
      product.subcategory,
      {
        $addToSet: { products: product._id }
      },
      { new: true }
    )

    // Xử lí danh mục mặc định cho sản phẩm khi không có danh mục nào được chọn
    if (!updatedSubcategory) {
      return res.status(400).json({ message: 'Cập nhật danh mục không thành công!' })
    }

    return res.status(201).json({
      message: 'Tạo sản phẩm thành công!',
      data: product
    })
  } catch (error) {
    next(error)
  }
}

export const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params
    const { error } = productValid.validate(req.body, { abortEarly: false })
    if (error) {
      const errors = error.details.map((item) => item.message)
      return res.status(400).json({ errors })
    }

    const productExists = await Product.findById(id)
    if (!productExists) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm' })
    }

    const existedProduct = await Product.findOne({ name: req.body.name })
    if (existedProduct && existedProduct._id != id) {
      return res.status(400).json({ message: 'Sản phẩm này đã tồn tại!' })
    }

    // Kiểm tra xem danh mục sản phẩm có thay đổi không
    if (req.body.subcategory !== productExists.subcategory) {
      // Loại bỏ sản phẩm khỏi danh mục cũ
      const oldSubcategory = await Subcategory.findByIdAndUpdate(productExists.subcategory, { $pull: { products: id } })
      if (!oldSubcategory) {
        return res.status(400).json({ message: 'Cập nhật danh mục không thành công!' })
      }

      // Thêm sản phẩm vào danh mục mới
      const newSubcategory = await Subcategory.findByIdAndUpdate(req.body.subcategory, { $push: { products: id } })
      if (!newSubcategory) {
        return res.status(400).json({ message: 'Cập nhật danh mục không thành công!' })
      }
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, req.body, { new: true })
    if (!updatedProduct) {
      return res.status(400).json({ message: 'Cập nhật sản phẩm không thành công!' })
    }

    return res.status(200).json({
      message: 'Cập nhật sản phẩm thành công!',
      data: updatedProduct
    })
  } catch (error) {
    next(error)
  }
}

export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id)
    if (!product) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm này' })
    }

    return res.status(200).json({ message: 'Xóa sản phẩm thành công' })
  } catch (error) {
    next(error)
  }
}
