import { Router } from 'express'
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
  updateProduct
} from '~/controllers/product.controller'
import { checkPermission } from '~/middlewares/checkPermission'

const routerProduct = Router()

routerProduct.get('/', getAllProducts)
routerProduct.get('/:id', getProductById)
routerProduct.post('/', checkPermission('admin'), createProduct)
routerProduct.put('/:id', checkPermission('admin'), updateProduct)
routerProduct.delete('/:id', checkPermission('admin'), deleteProduct)

export default routerProduct
