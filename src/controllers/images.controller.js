import cloudinary from '~/configs/cloudinary'
import User from '~/models/user.model'

export const uploadImages = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        message: 'Không có tệp ảnh nào được tải lên!'
      })
    }

    const uploadedFiles = []

    for (const file of req.files) {
      try {
        const result = await cloudinary.uploader.upload(file.path)
        uploadedFiles.push(result.secure_url)
      } catch (error) {
        // Xử lý lỗi tải lên cho từng tệp nhưng không gửi phản hồi ở đây
        return res.status(400).json({
          message: 'Tải ảnh lên thất bại!',
          error: error.message
        })
      }
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

export const uploadAvatar = async (req, res, next) => {
  try {
    const { id } = req.params
    const user = await User.findById(id)
    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng' })
    }

    cloudinary.uploader.upload(req.file.path, async (error, result) => {
      if (error) {
        return res.status(400).json({
          message: 'Tải ảnh lên thất bại!'
        })
      }

      user.avatar = result.secure_url
      await user.save()

      return res.status(200).json({
        message: 'Tải ảnh lên thành công!',
        avatar: result.secure_url
      })
    })
  } catch (error) {
    next(error)
  }
}
