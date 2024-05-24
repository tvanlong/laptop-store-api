import { Router } from 'express'
import { checkPermission } from '~/middlewares/checkPermission'
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
routerOrder.patch('/:userId/:orderId', checkPermission('admin', 'member'), updateStatusOrder)

export default routerOrder
