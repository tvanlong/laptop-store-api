import { Router } from 'express'
import {
  createCategory,
  deleteCategory,
  getAllCategories,
  getCategoryById,
  updateCategory
} from '~/controllers/category.controller'
import { checkPermission } from '~/middlewares/checkPermission'

const routerCategory = Router()

routerCategory.get('/', getAllCategories)
routerCategory.get('/:id', getCategoryById)
routerCategory.post('/', checkPermission('admin'), createCategory)
routerCategory.put('/:id', checkPermission('admin'), updateCategory)
routerCategory.delete('/:id', checkPermission('admin'), deleteCategory)

export default routerCategory
