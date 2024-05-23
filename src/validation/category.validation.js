import Joi from 'joi'

export const categoryValid = Joi.object({
  name: Joi.string().required().min(6).messages({
    'string.empty': 'Tên danh mục không được để trống',
    'any.required': 'Tên danh mục là bắt buộc',
    'string.min': 'Tên danh mục phải có ít nhất {#limit} ký tự'
  }),
  subcategories: Joi.array().items(Joi.string())
})
