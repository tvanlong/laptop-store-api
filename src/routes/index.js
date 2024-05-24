import { Router } from 'express'
import routerProduct from './product.route'
import routerAuth from './auth.route'
import routerSubcategory from './subcategory.route'
import routerCategory from './category.route'
import routerImages from './upload.route'
import routerVersion from './version.route'
import routerCart from './cart.route'
import routerOrder from './order.route'
import routerUser from './user.route'

const router = Router()

router.use('/categories', routerCategory)
router.use('/subcategories', routerSubcategory)
router.use('/products', routerProduct)
router.use('/versions', routerVersion)
router.use('/upload', routerImages)
router.use('/carts', routerCart)
router.use('/orders', routerOrder)
router.use('/users', routerUser)
router.use('/auth', routerAuth)

export default router
