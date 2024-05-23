import { Router } from 'express'

import { checkPermission } from '../middlewares/checkPermission.js'
import {
  createStaff,
  deleteStaff,
  getAllCustomers,
  getAllStaffs,
  getStaff,
  updateStaff
} from '../controllers/users.controller.js'

const routerUser = Router()

routerUser.get('/customers', checkPermission('admin'), getAllCustomers)
routerUser.get('/staffs', checkPermission('admin'), getAllStaffs)
routerUser.get('/staffs/:id', checkPermission('admin'), getStaff)
routerUser.post('/staffs', checkPermission('admin'), createStaff)
routerUser.patch('/staffs/:id', checkPermission('admin'), updateStaff)
routerUser.delete('/staffs/:id', checkPermission('admin'), deleteStaff)

export default routerUser
