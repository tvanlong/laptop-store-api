import { Router } from 'express'
import orderController from '~/controllers/order.controller'
import { checkPermission } from '~/middlewares/checkPermission'

const routerOrder = Router()

// Payment with Momo
routerOrder.post('/pay-with-momo/:userId', checkPermission('member'), orderController.createPaymentWithMomo)
routerOrder.post('/complete-pay-with-momo', checkPermission('member'), orderController.completePaymentWithMomo)
routerOrder.post('/transaction-status-momo', checkPermission('member'), orderController.receiveTransactionStatusMomo)

// Payment with ZaloPay
routerOrder.post('/pay-with-zalopay/:userId', checkPermission('member'), orderController.createPaymentWithZaloPay)
routerOrder.post('/complete-pay-with-zalopay', checkPermission('member'), orderController.completePaymentWithZaloPay)
routerOrder.post(
  '/transaction-status-zalopay',
  checkPermission('member'),
  orderController.receiveTransactionStatusZaloPay
)

routerOrder.get('/', checkPermission('admin'), orderController.getAllOrders)
routerOrder.post('/:userId', checkPermission('member'), orderController.createOrderCheckout)
routerOrder.get('/:userId', orderController.getOrdersByUserId)
routerOrder.get('/:userId/:orderId', checkPermission('admin'), orderController.getOrderById)
routerOrder.patch('/:userId/:orderId', checkPermission('admin', 'member', 'staff'), orderController.updateStatusOrder)

export default routerOrder
