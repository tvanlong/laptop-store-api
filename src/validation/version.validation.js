import Joi from 'joi'

export const versionValid = Joi.object({
  name: Joi.string().required().min(3).messages({
    'string.empty': 'Tên sản phẩm không được để trống',
    'any.required': 'Tên sản phẩm là bắt buộc',
    'string.min': 'Tên sản phẩm phải có ít nhất {#limit} ký tự'
  }),
  old_price: Joi.number().required().min(100).messages({
    'number.empty': 'Giá cũ không được để trống',
    'any.required': 'Giá cũ là bắt buộc',
    'number.min': 'Giá cũ phải lớn hơn hoặc bằng {#limit}'
  }),
  current_price: Joi.number().required().min(100).messages({
    'number.empty': 'Giá hiện tại không được để trống',
    'any.required': 'Giá hiện tại là bắt buộc',
    'number.min': 'Giá hiện tại phải lớn hơn hoặc bằng {#limit}'
  }),
  description: Joi.array().items(Joi.string().required().min(3)).required().messages({
    'array.empty': 'Mô tả không được để trống',
    'any.required': 'Mô tả là bắt buộc',
    'string.min': 'Mô tả phải có ít nhất {#limit} ký tự'
  }),
  product: Joi.string().required().messages({
    'string.empty': 'Sản phẩm không được để trống',
    'any.required': 'Sản phẩm là bắt buộc'
  }),
  status: Joi.string().required().messages({
    'string.empty': 'Trạng thái không được để trống',
    'any.required': 'Trạng thái là bắt buộc'
  }),
  is_featured: Joi.boolean().required().messages({
    'boolean.empty': 'Sản phẩm nổi bật không được để trống',
    'any.required': 'Sản phẩm nổi bật là bắt buộc'
  })
})
