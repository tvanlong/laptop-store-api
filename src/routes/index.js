import { Router } from 'express'
import routerProduct from './product.route.js'
import routerAuth from './auth.route.js'
import routerSubcategory from './subcategory.route.js'
import routerCategory from './category.route.js'
import routerImages from './upload.route.js'
import routerVersion from './version.route.js'
import routerCart from './cart.route.js'
import routerOrder from './order.route.js'
import routerUser from './user.route.js'

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
