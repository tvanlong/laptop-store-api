import { Router } from 'express'
import usersController from '~/controllers/users.controller'
import { checkPermission } from '~/middlewares/checkPermission'

const routerUser = Router()

// Route for customer
routerUser.get('/customers', checkPermission('admin'), usersController.getAllCustomers)
routerUser.get('/customers/:id', usersController.getCustomer)

// Route for customer and staff
routerUser.patch('/update-profile/:id', usersController.updateProfile)
routerUser.patch('/change-password/:id', usersController.changePassword)

// Route for staff
routerUser.get('/staffs', checkPermission('admin'), usersController.getAllStaffs)
routerUser.get('/staffs/:id', checkPermission('admin'), usersController.getStaff)
routerUser.post('/staffs', checkPermission('admin'), usersController.createStaff)
routerUser.patch('/staffs/:id', checkPermission('admin'), usersController.updateStaff)
routerUser.delete('/staffs/:id', checkPermission('admin'), usersController.deleteStaff)

export default routerUser
