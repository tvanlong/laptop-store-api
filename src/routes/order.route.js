import { Router } from 'express'
import {
  createOrderCheckout,
  getAllOrders,
  getOrderById,
  getOrdersByUserId,
  updateStatusOrder
} from '~/controllers/order.controller'

const routerOrder = Router()

routerOrder.get('/', getAllOrders)
routerOrder.post('/:userId', createOrderCheckout)
routerOrder.get('/:userId', getOrdersByUserId)
routerOrder.get('/:userId/:orderId', getOrderById)
routerOrder.patch('/:userId/:orderId', updateStatusOrder)

export default routerOrder
