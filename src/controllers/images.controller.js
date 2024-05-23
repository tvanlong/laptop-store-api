import fs from 'fs'

export const uploadImages = async (req, res) => {
  try {
    if (req.files.length <= 0) {
      return res.status(400).json({
        message: 'Không có file nào được tải lên!'
      })
    }

    const images = req.files.map((file) => file.filename)
    return res.status(200).json({
      message: 'Tải ảnh lên thành công!',
      files: images
    })
  } catch (error) {
    return res.status(500).json({
      name: error.name,
      message: error.message
    })
  }
}

export const getImage = async (req, res) => {
  try {
    const { filename } = req.params
    return res.status(200).sendFile(filename, { root: './src/uploads/' })
  } catch (error) {
    return res.status(500).json({
      name: error.name,
      message: error.message
    })
  }
}

export const deleteImage = async (req, res) => {
  try {
    const { filename } = req.params
    fs.unlinkSync(`./src/uploads/${filename}`)
    return res.status(200).json({
      message: 'Xóa ảnh thành công!'
    })
  } catch (error) {
    return res.status(500).json({
      name: error.name,
      message: error.message
    })
  }
}
