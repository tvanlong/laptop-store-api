import { Router } from 'express'
import orderController from '~/controllers/order.controller'
import { checkPermission } from '~/middlewares/checkPermission'

const routerOrder = Router()

// Payment with Momo
routerOrder.post('/pay-with-momo/:userId', checkPermission('member'), orderController.createPaymentWithMomo)
routerOrder.post('/complete-pay-with-momo', orderController.completePaymentWithMomo)
routerOrder.post('/transaction-status-momo', orderController.receiveTransactionStatusMomo)

// Payment with ZaloPay
routerOrder.post('/pay-with-zalopay/:userId', checkPermission('member'), orderController.createPaymentWithZaloPay)
routerOrder.post('/complete-pay-with-zalopay', orderController.completePaymentWithZaloPay)
routerOrder.post('/transaction-status-zalopay', orderController.receiveTransactionStatusZaloPay)

routerOrder.get('/', checkPermission('admin', 'staff'), orderController.getAllOrders)
routerOrder.post('/:userId', checkPermission('member'), orderController.createOrderCheckout)
routerOrder.get('/:userId', orderController.getOrdersByUserId)
routerOrder.get('/:userId/:orderId', checkPermission('admin', 'staff'), orderController.getOrderById)
routerOrder.patch('/:userId/:orderId', checkPermission('admin', 'member', 'staff'), orderController.updateStatusOrder)

export default routerOrder
