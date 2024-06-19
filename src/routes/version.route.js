import { Router } from 'express'
import versionController from '~/controllers/version.controller'
import { checkPermission } from '~/middlewares/checkPermission'

const routerVersion = Router()

routerVersion.get('/', versionController.getAllVersions)
routerVersion.get('/featured', versionController.getAllFeaturedVersions)
routerVersion.get('/category/:category', versionController.getAllVersionsByCategory)
routerVersion.get('/subcategory/:subcategory', versionController.getAllVersionsBySubcategory)
routerVersion.get('/:id', versionController.getVersionById)
routerVersion.post('/', checkPermission('admin'), versionController.createVersion)
routerVersion.put('/:id', checkPermission('admin'), versionController.updateVersion)
routerVersion.delete('/:id', checkPermission('admin'), versionController.deleteVersion)

export default routerVersion
