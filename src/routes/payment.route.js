import { Router } from 'express'
import paymentController from '~/controllers/payment.controller'

const routerPayment = Router()

routerPayment.get('/', paymentController.getAllPaymentMethods)
routerPayment.post('/', paymentController.createPaymentMethod)

export default routerPayment
