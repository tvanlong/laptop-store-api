import { Router } from 'express'
import subcategoryController from '~/controllers/subcategory.controller'
import { checkPermission } from '~/middlewares/checkPermission'

const routerSubcategory = Router()

routerSubcategory.get('/', subcategoryController.getAllSubcategories)
routerSubcategory.get('/:id', subcategoryController.getSubcategoryById)
routerSubcategory.post('/', checkPermission('admin'), subcategoryController.createSubcategory)
routerSubcategory.put('/:id', checkPermission('admin'), subcategoryController.updateSubcategory)
routerSubcategory.delete('/:id', checkPermission('admin'), subcategoryController.deleteSubcategory)

export default routerSubcategory
