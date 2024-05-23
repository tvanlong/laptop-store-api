import { Router } from 'express'
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} from '../controllers/product.controller.js'
import { checkPermission } from '../middlewares/checkPermission.js'

const routerProduct = Router()

routerProduct.get('/', getAllProducts)
routerProduct.get('/:id', getProductById)
routerProduct.post('/', checkPermission('admin'), createProduct)
routerProduct.put('/:id', checkPermission('admin'), updateProduct)
routerProduct.delete('/:id', checkPermission('admin'), deleteProduct)

export default routerProduct
