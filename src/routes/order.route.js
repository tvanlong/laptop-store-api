import { Router } from 'express'
import orderController from '~/controllers/order.controller'

const routerOrder = Router()

// Payment with Momo
routerOrder.post('/pay-with-momo/:userId', orderController.createPaymentWithMomo)
routerOrder.post('/complete-pay-with-momo', orderController.completePaymentWithMomo)
routerOrder.post('/transaction-status-momo', orderController.receiveTransactionStatus)

routerOrder.get('/', orderController.getAllOrders)
routerOrder.post('/:userId', orderController.createOrderCheckout)
routerOrder.get('/:userId', orderController.getOrdersByUserId)
routerOrder.get('/:userId/:orderId', orderController.getOrderById)
routerOrder.patch('/:userId/:orderId', orderController.updateStatusOrder)

export default routerOrder
