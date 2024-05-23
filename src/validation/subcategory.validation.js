import Joi from 'joi'

export const subcategoryValid = Joi.object({
  name: Joi.string().required().min(6).messages({
    'string.empty': 'Tên danh mục không được để trống',
    'any.required': 'Tên danh mục là bắt buộc',
    'string.min': 'Tên danh mục phải có ít nhất {#limit} ký tự'
  }),
  category: Joi.string().required().messages({
    'string.empty': 'Danh mục cha không được để trống',
    'any.required': 'Danh mục cha là bắt buộc'
  }),
  products: Joi.array().items(Joi.string())
})
