import { Router } from 'express'
import cartController from '~/controllers/cart.controller'
import { checkPermission } from '~/middlewares/checkPermission'

const routerCart = Router()

routerCart.get('/:userId', checkPermission('member'), cartController.getCart)
routerCart.post('/:userId', checkPermission('member'), cartController.addItemToCart)
routerCart.patch('/:userId', checkPermission('member'), cartController.updateCartQuantity)
routerCart.patch('/:userId/increase', checkPermission('member'), cartController.increaseQuantity)
routerCart.patch('/:userId/decrease', checkPermission('member'), cartController.decreaseQuantity)
routerCart.delete('/:userId', checkPermission('member'), cartController.removeItem)
routerCart.delete('/:userId/all', checkPermission('member'), cartController.removeCart)

export default routerCart
