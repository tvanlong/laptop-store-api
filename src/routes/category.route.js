import { Router } from 'express'
import categoryController from '~/controllers/category.controller'
import { checkPermission } from '~/middlewares/checkPermission'

const routerCategory = Router()

routerCategory.get('/', categoryController.getAllCategories)
routerCategory.get('/:id', categoryController.getCategoryById)
routerCategory.post('/', checkPermission('admin', 'staff'), categoryController.createCategory)
routerCategory.put('/:id', checkPermission('admin', 'staff'), categoryController.updateCategory)
routerCategory.delete('/:id', checkPermission('admin', 'staff'), categoryController.deleteCategory)

export default routerCategory
