import Category from '~/models/category.model'
import Product from '~/models/product.model'
import Subcategory from '~/models/subcategory.model'

const getSortOptions = (sort, order) => {
  const sortOptions = {}
  if (sort && order) {
    if (sort === 'createdAt') {
      sortOptions[sort] = order === 'new' ? -1 : 1
    } else if (sort === 'price') {
      sortOptions['current_price'] = order === 'asc' ? 1 : -1
    }
  }
  return sortOptions
}

const getProductIds = async (keyword) => {
  if (!keyword) return []

  const products = await Product.find({
    name: { $regex: keyword, $options: 'i' }
  }).select('_id')

  return products.map((product) => product._id)
}

const applyPriceRangeFilter = (filter, price_min, price_max) => {
  if (price_min !== undefined && price_max !== undefined) {
    filter['current_price'] = { $gte: parseInt(price_min), $lte: parseInt(price_max) }
  } else if (price_min !== undefined && price_max === undefined) {
    filter['current_price'] = { $gte: parseInt(price_min) }
  } else if (price_min === undefined && price_max !== undefined) {
    filter['current_price'] = { $lte: parseInt(price_max) }
  }
}

const applyRegexFilters = (filter, ram, memory, screen, cpu, vga) => {
  const regexFilters = [
    { key: 'description', field: 'RAM', value: ram },
    { key: 'description', field: 'Ổ cứng', value: memory },
    { key: 'description', field: 'Màn hình', value: screen },
    { key: 'description', field: 'CPU', value: cpu },
    { key: 'description', field: 'VGA', value: vga }
  ]

  regexFilters.forEach(({ key, field, value }) => {
    if (value) {
      filter[key] = { $regex: `${field}: ${value}`, $options: 'i' }
    }
  })
}

const excludeProductsByCategoryName = async (categoryName) => {
  const categoryToExclude = await Category.findOne({ name: categoryName })
  if (!categoryToExclude) {
    return []
  }

  const subcategoriesToExclude = await Subcategory.find({ category: categoryToExclude._id }).select('_id')
  const subcategoryIdsToExclude = subcategoriesToExclude.map((subcategory) => subcategory._id)
  const productsToExclude = await Product.find({ subcategory: { $in: subcategoryIdsToExclude } }).select('_id')
  const productIdsToExclude = productsToExclude.map((product) => product._id)

  return productIdsToExclude
}

export default {
  getSortOptions,
  getProductIds,
  applyPriceRangeFilter,
  applyRegexFilters,
  excludeProductsByCategoryName
}
