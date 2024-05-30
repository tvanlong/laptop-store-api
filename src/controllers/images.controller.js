// import fs from 'fs'
// const path = require('node:path')
import cloudinary from '~/configs/cloudinary'

export const uploadImages = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        message: 'Không có tệp ảnh nào được tải lên!'
      })
    }

    const uploadedFiles = []

    for (const file of req.files) {
      // eslint-disable-next-line no-unused-vars
      const result = await cloudinary.uploader.upload(file.path, (error, result) => {
        if (error) {
          return res.status(400).json({
            message: 'Tải ảnh lên thất bại!'
          })
        }
      })
      uploadedFiles.push(result.secure_url)
    }

    return res.status(200).json({
      message: 'Tải ảnh lên thành công!',
      files: uploadedFiles
    })
  } catch (error) {
    next(error)
  }
}

export const deleteImage = async (req, res, next) => {
  try {
    const { public_id } = req.params
    // eslint-disable-next-line no-unused-vars
    cloudinary.uploader.destroy(public_id, (error, result) => {
      if (error) {
        return res.status(400).json({
          message: 'Xóa ảnh thất bại!'
        })
      }
      return res.status(200).json({
        message: 'Xóa ảnh thành công!'
      })
    })
  } catch (error) {
    next(error)
  }
}
