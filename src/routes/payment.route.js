import { Router } from 'express'
import paymentController from '~/controllers/payment.controller'

const routerPayment = Router()

routerPayment.post('/momo', paymentController.createPaymentWithMomo)
routerPayment.post('/momo/complete', paymentController.completePaymentWithMomo)
routerPayment.post('/momo/transaction-status', paymentController.receiveTransactionStatus)

export default routerPayment
