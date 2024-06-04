import { Router } from 'express'
import orderController from '~/controllers/order.controller'

const routerOrder = Router()

routerOrder.get('/', orderController.getAllOrders)
routerOrder.post('/:userId', orderController.createOrderCheckout)
routerOrder.get('/:userId', orderController.getOrdersByUserId)
routerOrder.get('/:userId/:orderId', orderController.getOrderById)
routerOrder.patch('/:userId/:orderId', orderController.updateStatusOrder)

export default routerOrder
