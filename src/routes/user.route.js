import { Router } from 'express'
import {
  changePassword,
  createStaff,
  deleteStaff,
  getAllCustomers,
  getAllStaffs,
  getCustomer,
  getStaff,
  updateCustomer,
  updateStaff
} from '~/controllers/users.controller'
import { checkPermission } from '~/middlewares/checkPermission'

const routerUser = Router()

// Route for customer
routerUser.get('/customers', checkPermission('admin'), getAllCustomers)
routerUser.get('/customers/:id', getCustomer)
routerUser.patch('/customers/:id', updateCustomer)
routerUser.patch('/customers/:id/change-password', changePassword)

// Route for staff
routerUser.get('/staffs', checkPermission('admin'), getAllStaffs)
routerUser.get('/staffs/:id', checkPermission('admin'), getStaff)
routerUser.post('/staffs', checkPermission('admin'), createStaff)
routerUser.patch('/staffs/:id', checkPermission('admin'), updateStaff)
routerUser.delete('/staffs/:id', checkPermission('admin'), deleteStaff)

export default routerUser
