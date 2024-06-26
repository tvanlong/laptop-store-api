import { Router } from 'express'
import versionController from '~/controllers/version.controller'
import { checkPermission } from '~/middlewares/checkPermission'

const routerVersion = Router()

routerVersion.get('/', versionController.getAllVersions)
routerVersion.get('/accessory', versionController.getAllAccessories)
routerVersion.get('/featured', versionController.getAllFeaturedVersions)
routerVersion.get('/category/:category', versionController.getAllVersionsByCategory)
routerVersion.get('/subcategory/:subcategory', versionController.getAllVersionsBySubcategory)
routerVersion.get('/trash-versions', checkPermission('admin', 'staff'), versionController.getListDeletedVersions)
routerVersion.get('/:id', versionController.getVersionById)
routerVersion.post('/', checkPermission('admin', 'staff'), versionController.createVersion)
routerVersion.put('/:id', checkPermission('admin', 'staff'), versionController.updateVersion)
routerVersion.delete('/soft-delete/:id', checkPermission('admin', 'staff'), versionController.softDeleteVersion)
routerVersion.patch('/restore-deleted/:id', checkPermission('admin', 'staff'), versionController.restoreDeletedVersion)
routerVersion.delete('/:id', checkPermission('admin', 'staff'), versionController.deleteVersion)

export default routerVersion
