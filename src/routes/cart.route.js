import { Router } from 'express'
import {
  addItemToCart,
  decreaseQuantity,
  getCart,
  increaseQuantity,
  removeCart,
  removeItem,
  updateCartQuantity
} from '~/controllers/cart.controller.js'

const routerCart = Router()

routerCart.get('/:userId', getCart)
routerCart.post('/:userId', addItemToCart)
routerCart.patch('/:userId', updateCartQuantity)
routerCart.patch('/:userId/increase', increaseQuantity)
routerCart.patch('/:userId/decrease', decreaseQuantity)
routerCart.delete('/:userId', removeItem)
routerCart.delete('/:userId/all', removeCart)

export default routerCart
