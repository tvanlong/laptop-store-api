import { Router } from 'express'
import orderController from '~/controllers/order.controller'

const routerOrder = Router()

// Payment with Momo
routerOrder.post('/pay-with-momo/:userId', orderController.createPaymentWithMomo)
routerOrder.post('/complete-pay-with-momo', orderController.completePaymentWithMomo)
routerOrder.post('/transaction-status-momo', orderController.receiveTransactionStatusMomo)

// Payment with ZaloPay
routerOrder.post('/pay-with-zalopay/:userId', orderController.createPaymentWithZaloPay)
routerOrder.post('/complete-pay-with-zalopay', orderController.completePaymentWithZaloPay)
routerOrder.post('/transaction-status-zalopay', orderController.receiveTransactionStatusZaloPay)

routerOrder.get('/', orderController.getAllOrders)
routerOrder.post('/:userId', orderController.createOrderCheckout)
routerOrder.get('/:userId', orderController.getOrdersByUserId)
routerOrder.get('/:userId/:orderId', orderController.getOrderById)
routerOrder.patch('/:userId/:orderId', orderController.updateStatusOrder)

export default routerOrder
