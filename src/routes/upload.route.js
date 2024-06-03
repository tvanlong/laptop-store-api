import { Router } from 'express'
import { deleteImage, uploadAvatar, uploadImages } from '~/controllers/images.controller'
import { uploadStorage } from '~/middlewares/uploadStorage'

const routerImages = Router()

routerImages.post('/', uploadStorage.array('files'), uploadImages)
routerImages.delete('/:public_id', deleteImage)
routerImages.patch('/avatar/:id', uploadStorage.single('avatar'), uploadAvatar)

export default routerImages
