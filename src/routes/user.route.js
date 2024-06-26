import { Router } from 'express'
import usersController from '~/controllers/users.controller'
import { checkPermission } from '~/middlewares/checkPermission'

const routerUser = Router()

// Route for customer
routerUser.get('/customers', checkPermission('admin', 'staff'), usersController.getAllCustomers)
routerUser.get('/customers/:id', checkPermission('member'), usersController.getCustomer)

// Route for customer and staff
routerUser.patch('/update-profile/:id', checkPermission('admin', 'staff', 'member'), usersController.updateProfile)
routerUser.patch('/change-password/:id', checkPermission('admin', 'staff', 'member'), usersController.changePassword)

// Route for staff
routerUser.get('/staffs', checkPermission('admin'), usersController.getAllStaffs)
routerUser.get('/staffs/:id', checkPermission('admin', 'staff'), usersController.getStaff)
routerUser.post('/staffs', checkPermission('admin'), usersController.createStaff)
routerUser.patch('/staffs/:id', checkPermission('admin'), usersController.updateStaff)
routerUser.delete('/staffs/soft-delete/:id', checkPermission('admin'), usersController.softDeleteStaff)
routerUser.get('/trash-staffs', checkPermission('admin'), usersController.getListDeletedStaffs)
routerUser.patch('/staffs/restore-deleted/:id', checkPermission('admin'), usersController.restoreDeletedStaff)
routerUser.delete('/staffs/:id', checkPermission('admin'), usersController.deleteStaff)

export default routerUser
