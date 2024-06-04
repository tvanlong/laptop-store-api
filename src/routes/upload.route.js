import { Router } from 'express'
import imagesController from '~/controllers/images.controller'
import { uploadStorage } from '~/middlewares/uploadStorage'

const routerImages = Router()

routerImages.post('/', uploadStorage.array('files'), imagesController.uploadImages)
routerImages.delete('/:public_id', imagesController.deleteImage)
routerImages.patch('/avatar/:id', uploadStorage.single('avatar'), imagesController.uploadAvatar)

export default routerImages
