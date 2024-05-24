import { Router } from 'express'
import {
  getAllSubcategories,
  getSubcategoryById,
  createSubcategory,
  updateSubcategory,
  deleteSubcategory
} from '~/controllers/subcategory.controller'
import { checkPermission } from '~/middlewares/checkPermission'

const routerSubcategory = Router()

routerSubcategory.get('/', getAllSubcategories)
routerSubcategory.get('/:id', getSubcategoryById)
routerSubcategory.post('/', checkPermission('admin'), createSubcategory)
routerSubcategory.put('/:id', checkPermission('admin'), updateSubcategory)
routerSubcategory.delete('/:id', checkPermission('admin'), deleteSubcategory)

export default routerSubcategory
