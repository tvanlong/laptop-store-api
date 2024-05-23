import { Router } from 'express'
import {
  createVersion,
  deleteVersion,
  getAllVersions,
  getAllVersionsByCategory,
  getAllVersionsBySubcategory,
  getVersionById,
  updateVersion
} from '../controllers/version.controller.js'
import { checkPermission } from '../middlewares/checkPermission.js'

const routerVersion = Router()

routerVersion.get('/', getAllVersions)
routerVersion.get('/category/:category', getAllVersionsByCategory)
routerVersion.get('/subcategory/:subcategory', getAllVersionsBySubcategory)
routerVersion.get('/:id', getVersionById)
routerVersion.post('/', checkPermission('admin'), createVersion)
routerVersion.put('/:id', checkPermission('admin'), updateVersion)
routerVersion.delete('/:id', checkPermission('admin'), deleteVersion)

export default routerVersion
