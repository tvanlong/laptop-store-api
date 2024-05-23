import { Router } from 'express'
import { uploadStorage } from '~/middlewares/uploadStorage.js'
import { deleteImage, getImage, uploadImages } from '~/controllers/images.controller.js'

const routerImages = Router()

routerImages.post('/', uploadStorage.array('files'), uploadImages)
routerImages.get('/:filename', getImage)
routerImages.delete('/:filename', deleteImage)

export default routerImages
