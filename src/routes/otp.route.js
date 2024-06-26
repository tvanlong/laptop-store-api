import { Router } from 'express'
import otpController from '~/controllers/otp.controller'
import { checkPermission } from '~/middlewares/checkPermission'

const routerOTP = Router()

routerOTP.post('/change-email/:id', checkPermission('admin', 'staff', 'member'), otpController.sendOTPToChangeEmail)
routerOTP.patch('/verify-email/:id', checkPermission('admin', 'staff', 'member'), otpController.verifyOTPToChangeEmail)

export default routerOTP
