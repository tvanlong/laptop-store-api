import { Router } from 'express'
import routerAuth from './auth.route'
import routerCart from './cart.route'
import routerCategory from './category.route'
import routerOrder from './order.route'
import routerOTP from './otp.route'
import routerPayment from './payment.route'
import routerProduct from './product.route'
import routerSubcategory from './subcategory.route'
import routerImages from './upload.route'
import routerUser from './user.route'
import routerVersion from './version.route'

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
router.use('/payment', routerPayment)
router.use('/otps', routerOTP)

export default router
