import { Router } from 'express'
import {
  addItemToCart,
  decreaseQuantity,
  getCart,
  increaseQuantity,
  removeCart,
  removeItem,
  updateCartQuantity
} from '~/controllers/cart.controller'
import { checkPermission } from '~/middlewares/checkPermission'

const routerCart = Router()

routerCart.get('/:userId', checkPermission('member'), getCart)
routerCart.post('/:userId', checkPermission('member'), addItemToCart)
routerCart.patch('/:userId', checkPermission('member'), updateCartQuantity)
routerCart.patch('/:userId/increase', checkPermission('member'), increaseQuantity)
routerCart.patch('/:userId/decrease', checkPermission('member'), decreaseQuantity)
routerCart.delete('/:userId', checkPermission('member'), removeItem)
routerCart.delete('/:userId/all', checkPermission('member'), removeCart)

export default routerCart
