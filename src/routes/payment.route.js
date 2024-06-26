import { Router } from 'express'
import paymentController from '~/controllers/payment.controller'
import { checkPermission } from '~/middlewares/checkPermission'

const routerPayment = Router()

routerPayment.get('/', checkPermission('admin'), paymentController.getAllPaymentMethods)
routerPayment.post('/', checkPermission('admin'), paymentController.createPaymentMethod)

export default routerPayment
