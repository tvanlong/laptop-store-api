import { Router } from 'express'
import {
  changePassword,
  createStaff,
  deleteStaff,
  getAllCustomers,
  getAllStaffs,
  getCustomer,
  getStaff,
  updateProfile,
  updateStaff
} from '~/controllers/users.controller'
import { checkPermission } from '~/middlewares/checkPermission'

const routerUser = Router()

// Route for customer
routerUser.get('/customers', checkPermission('admin'), getAllCustomers)
routerUser.get('/customers/:id', getCustomer)

// Route for customer and staff
routerUser.patch('/update-profile/:id', updateProfile)
routerUser.patch('/change-password/:id', changePassword)

// Route for staff
routerUser.get('/staffs', checkPermission('admin'), getAllStaffs)
routerUser.get('/staffs/:id', checkPermission('admin'), getStaff)
routerUser.post('/staffs', checkPermission('admin'), createStaff)
routerUser.patch('/staffs/:id', checkPermission('admin'), updateStaff)
routerUser.delete('/staffs/:id', checkPermission('admin'), deleteStaff)

export default routerUser
