/* eslint-disable indent */
import Product from '~/models/product.model'
import Version from '~/models/version.model'
import versionService from '~/services/version.service'
import { versionValid } from '~/validation/version.validation'

const getAllVersions = async (req, res, next) => {
  try {
    const { page, limit, sort, order, keyword, price_min, price_max, ram, memory, screen, cpu, vga } = req.query
    const options = {
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 10,
      populate: {
        path: 'product',
        select: 'name images subcategory',
        populate: {
          path: 'subcategory',
          select: 'name category'
        }
      },
      sort: versionService.getSortOptions(sort, order)
    }

    const filter = {}
    // Lấy danh sách ID sản phẩm dựa trên từ khóa tìm kiếm
    if (keyword) {
      const productIds = await versionService.getProductIds(keyword)
      if (productIds.length > 0) {
        filter['product'] = { $in: productIds }
      } else if (productIds.length === 0) {
        return res.status(200).json({
          message: 'Không tìm thấy sản phẩm nào!',
          data: []
        })
      }
    }

    // Áp dụng bộ lọc giá
    versionService.applyPriceRangeFilter(filter, price_min, price_max)
    // Áp dụng bộ lọc regex theo cấu hình
    versionService.applyRegexFilters(filter, ram, memory, screen, cpu, vga)

    const versions = await Version.paginate(filter, options)
    if (versions.totalDocs === 0) {
      return res.status(200).json({
        message: 'Không tìm thấy sản phẩm nào!',
        data: []
      })
    }

    return res.status(200).json({
      message: 'Lấy sản phẩm thành công!',
      data: versions
    })
  } catch (error) {
    next(error)
  }
}

const getAllVersionsByCategory = async (req, res, next) => {
  try {
    const { category } = req.params
    const { page, limit, sort, order, price_min, price_max, ram, memory, screen, cpu, vga } = req.query
    const versions = await Version.find().populate({
      path: 'product',
      populate: {
        path: 'subcategory',
        match: { category }
      }
    })
    const filteredVersions = versions.filter((version) => version.product && version.product.subcategory)

    const options = {
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 10,
      populate: {
        path: 'product',
        select: 'name images subcategory',
        populate: {
          path: 'subcategory',
          select: 'name category'
        }
      },
      sort: versionService.getSortOptions(sort, order)
    }

    const filter = {}
    // Áp dụng bộ lọc giá
    versionService.applyPriceRangeFilter(filter, price_min, price_max)
    // Áp dụng bộ lọc regex theo cấu hình
    versionService.applyRegexFilters(filter, ram, memory, screen, cpu, vga)

    const versionsByCategory = await Version.paginate(
      { product: { $in: filteredVersions.map((version) => version.product._id) }, ...filter },
      options
    )
    if (versionsByCategory.totalDocs === 0) {
      return res.status(200).json({
        message: 'Không tìm thấy sản phẩm nào!',
        data: []
      })
    }

    return res.status(200).json({
      message: 'Lấy sản phẩm thành công!',
      data: versionsByCategory
    })
  } catch (error) {
    next(error)
  }
}

const getAllVersionsBySubcategory = async (req, res, next) => {
  try {
    const { subcategory } = req.params
    const { page, limit, sort, order, price_min, price_max, ram, memory, screen, cpu, vga } = req.query
    const versions = await Version.find().populate({
      path: 'product',
      match: { subcategory }
    })
    const filteredVersions = versions.filter((version) => version.product && version.product.subcategory)

    const options = {
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 10,
      populate: {
        path: 'product',
        select: 'name images subcategory',
        populate: {
          path: 'subcategory',
          select: 'name category'
        }
      },
      sort: versionService.getSortOptions(sort, order)
    }

    const filter = {}
    // Áp dụng bộ lọc giá
    versionService.applyPriceRangeFilter(filter, price_min, price_max)
    // Áp dụng bộ lọc regex theo cấu hình
    versionService.applyRegexFilters(filter, ram, memory, screen, cpu, vga)

    const versionsBySubcategory = await Version.paginate(
      { product: { $in: filteredVersions.map((version) => version.product._id) }, ...filter },
      options
    )
    if (versionsBySubcategory.totalDocs === 0) {
      return res.status(200).json({
        message: 'Không tìm thấy sản phẩm nào!',
        data: []
      })
    }

    return res.status(200).json({
      message: 'Lấy sản phẩm thành công!',
      data: versionsBySubcategory
    })
  } catch (error) {
    next(error)
  }
}

const getVersionById = async (req, res, next) => {
  try {
    const version = await Version.findById(req.params.id).populate({
      path: 'product',
      select: 'name images subcategory',
      populate: {
        path: 'subcategory',
        select: 'name category'
      }
    })
    if (!version) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm này!' })
    }

    return res.status(200).json({
      message: 'Lấy sản phẩm thành công!',
      data: version
    })
  } catch (error) {
    next(error)
  }
}

const createVersion = async (req, res, next) => {
  try {
    const existedVersion = await Version.findOne({ name: req.body.name })
    if (existedVersion) {
      return res.status(400).json({ message: 'Sản phẩm này đã tồn tại!' })
    }

    const { error } = versionValid.validate(req.body, { abortEarly: false })
    if (error) {
      const errors = error.details.map((item) => item.message)
      return res.status(400).json({ errors })
    }

    const version = await Version.create(req.body)
    if (!version) {
      return res.status(400).json({ message: 'Tạo sản phẩm không thành công!' })
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      version.product,
      { $addToSet: { versions: version._id } },
      { new: true }
    )
    if (!updatedProduct) {
      return res.status(400).json({ message: 'Cập nhật sản phẩm không thành công!' })
    }

    return res.status(201).json({
      message: 'Tạo sản phẩm thành công!',
      data: version
    })
  } catch (error) {
    next(error)
  }
}

const updateVersion = async (req, res, next) => {
  try {
    const { error } = versionValid.validate(req.body, { abortEarly: false })
    if (error) {
      const errors = error.details.map((item) => item.message)
      return res.status(400).json({ errors })
    }

    const existedVersion = await Version.findOne({ name: req.body.name })
    if (existedVersion && existedVersion._id != req.params.id) {
      return res.status(400).json({ message: 'Sản phẩm này đã tồn tại!' })
    }

    const version = await Version.findById(req.params.id)
    if (!version) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm này!' })
    }

    if (req.body.product !== version.product) {
      const oldProduct = await Product.findByIdAndUpdate(version.product, { $pull: { versions: version._id } })
      if (!oldProduct) {
        return res.status(400).json({ message: 'Cập nhật sản phẩm không thành công!' })
      }

      const newProduct = await Product.findByIdAndUpdate(req.body.product, { $push: { versions: version._id } })
      if (!newProduct) {
        return res.status(400).json({ message: 'Cập nhật sản phẩm không thành công!' })
      }
    }

    const updatedVersion = await Version.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!updatedVersion) {
      return res.status(400).json({ message: 'Cập nhật sản phẩm không thành công!' })
    }

    return res.status(200).json({
      message: 'Cập nhật sản phẩm thành công!',
      data: updatedVersion
    })
  } catch (error) {
    next(error)
  }
}

const deleteVersion = async (req, res, next) => {
  try {
    const version = await Version.findById(req.params.id)
    if (!version) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm này!' })
    }

    const deletedVersion = await Version.findByIdAndDelete(req.params.id)
    if (!deletedVersion) {
      return res.status(400).json({ message: 'Xóa sản phẩm không thành công!' })
    }

    const updatedProduct = await Product.findByIdAndUpdate(version.product, { $pull: { versions: version._id } })
    if (!updatedProduct) {
      return res.status(400).json({ message: 'Cập nhật sản phẩm không thành công!' })
    }

    return res.status(200).json({
      message: 'Xóa sản phẩm thành công!',
      data: deletedVersion
    })
  } catch (error) {
    next(error)
  }
}

export default {
  getAllVersions,
  getAllVersionsByCategory,
  getAllVersionsBySubcategory,
  getVersionById,
  createVersion,
  updateVersion,
  deleteVersion
}
