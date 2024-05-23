import Joi from 'joi'

export const productValid = Joi.object({
  name: Joi.string().required().min(3).messages({
    'string.empty': 'Tên sản phẩm không được để trống',
    'any.required': 'Tên sản phẩm là bắt buộc',
    'string.min': 'Tên sản phẩm phải có ít nhất {#limit} ký tự'
  }),
  images: Joi.array().items(Joi.string().required()).required().messages({
    'array.empty': 'Ảnh sản phẩm không được để trống',
    'any.required': 'Ảnh sản phẩm là bắt buộc'
  }),
  subcategory: Joi.string().required().messages({
    'string.empty': 'Danh mục sản phẩm không được để trống',
    'any.required': 'Danh mục sản phẩm là bắt buộc'
  })
})
