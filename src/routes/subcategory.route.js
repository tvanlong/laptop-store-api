import { Router } from 'express'
import {
  getAllSubcategories,
  getSubcategoryById,
  createSubcategory,
  updateSubcategory,
  deleteSubcategory
} from '../controllers/subcategory.controller.js'
import { checkPermission } from '../middlewares/checkPermission.js'

const routerSubcategory = Router()

routerSubcategory.get('/', getAllSubcategories)
routerSubcategory.get('/:id', getSubcategoryById)
routerSubcategory.post('/', checkPermission('admin'), createSubcategory)
routerSubcategory.put('/:id', checkPermission('admin'), updateSubcategory)
routerSubcategory.delete('/:id', checkPermission('admin'), deleteSubcategory)

export default routerSubcategory
