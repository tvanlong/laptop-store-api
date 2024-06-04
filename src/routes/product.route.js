import { Router } from 'express'
import productController from '~/controllers/product.controller'
import { checkPermission } from '~/middlewares/checkPermission'

const routerProduct = Router()

routerProduct.get('/', productController.getAllProducts)
routerProduct.get('/:id', productController.getProductById)
routerProduct.post('/', checkPermission('admin'), productController.createProduct)
routerProduct.put('/:id', checkPermission('admin'), productController.updateProduct)
routerProduct.delete('/:id', checkPermission('admin'), productController.deleteProduct)

export default routerProduct
