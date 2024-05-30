import { Router } from 'express'
import { uploadStorage } from '~/middlewares/uploadStorage'
import { deleteImage, uploadImages } from '~/controllers/images.controller'

const routerImages = Router()

routerImages.post('/', uploadStorage.array('files'), uploadImages)
routerImages.delete('/:public_id', deleteImage)

export default routerImages
