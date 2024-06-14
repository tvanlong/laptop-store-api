import Joi from 'joi'

export const signUpValid = Joi.object({
  name: Joi.string().required().min(6).messages({
    'string.empty': 'Tên người dùng không được để trống',
    'any.required': 'Tên người dùng là bắt buộc',
    'string.min': 'Tên người dùng phải có ít nhất {#limit} ký tự'
  }),
  phone: Joi.string().required().messages({
    'string.empty': 'Số điện thoại không được để trống',
    'any.required': 'Số điện thoại là bắt buộc'
  }),
  email: Joi.string().required().email().messages({
    'string.empty': 'Email không được để trống',
    'any.required': 'Email là bắt buộc',
    'string.email': 'Email không đúng định dạng'
  }),
  password: Joi.string().required().min(6).messages({
    'string.empty': 'Mật khẩu không được để trống',
    'any.required': 'Mật khẩu là bắt buộc',
    'string.min': 'Mật khẩu phải có ít nhất {#limit} ký tự'
  }),
  confirm_password: Joi.string().required().valid(Joi.ref('password')).messages({
    'string.empty': 'Mật khẩu xác nhận không được để trống',
    'any.required': 'Mật khẩu xác nhận là bắt buộc',
    'any.only': 'Mật khẩu xác nhận phải trùng với mật khẩu'
  }),
  role: Joi.string().default('member').messages({
    'string.base': 'Quyền phải là chuỗi',
    'string.empty': 'Quyền không được để trống'
  })
})

export const signInValid = Joi.object({
  email: Joi.string().required().email().messages({
    'string.empty': 'Email không được để trống',
    'any.required': 'Email là bắt buộc',
    'string.email': 'Email không đúng định dạng'
  }),
  password: Joi.string().required().min(6).messages({
    'string.empty': 'Mật khẩu không được để trống',
    'any.required': 'Mật khẩu là bắt buộc',
    'string.min': 'Mật khẩu phải có ít nhất {#limit} ký tự'
  })
})

export const userValid = Joi.object({
  name: Joi.string().required().min(6).messages({
    'string.empty': 'Tên người dùng không được để trống',
    'any.required': 'Tên người dùng là bắt buộc',
    'string.min': 'Tên người dùng phải có ít nhất {#limit} ký tự'
  }),
  phone: Joi.string()
    .regex(/(84|0[3|5|7|8|9])+([0-9]{8})\b/)
    .required()
    .messages({
      'string.empty': 'Số điện thoại không được để trống',
      'any.required': 'Số điện thoại là bắt buộc',
      'string.pattern.base': 'Số điện thoại không đúng định dạng'
    }),
  email: Joi.string().required().email().messages({
    'string.empty': 'Email không được để trống',
    'any.required': 'Email là bắt buộc',
    'string.email': 'Email không đúng định dạng'
  }),
  password: Joi.string().required().min(6).messages({
    'string.empty': 'Mật khẩu không được để trống',
    'any.required': 'Mật khẩu là bắt buộc',
    'string.min': 'Mật khẩu phải có ít nhất {#limit} ký tự'
  }),
  confirm_password: Joi.string().required().valid(Joi.ref('password')).messages({
    'string.empty': 'Mật khẩu xác nhận không được để trống',
    'any.required': 'Mật khẩu xác nhận là bắt buộc',
    'any.only': 'Mật khẩu xác nhận phải trùng với mật khẩu'
  }),
  role: Joi.string().default('member').messages({
    'string.base': 'Quyền phải là chuỗi',
    'string.empty': 'Quyền không được để trống'
  })
})

export const profileCustomerValid = Joi.object({
  name: Joi.string().required().min(6).messages({
    'string.empty': 'Tên người dùng không được để trống',
    'any.required': 'Tên người dùng là bắt buộc',
    'string.min': 'Tên người dùng phải có ít nhất {#limit} ký tự'
  }),
  phone: Joi.string()
    .regex(/(84|0[3|5|7|8|9])+([0-9]{8})\b/)
    .required()
    .messages({
      'string.empty': 'Số điện thoại không được để trống',
      'any.required': 'Số điện thoại là bắt buộc',
      'string.pattern.base': 'Số điện thoại không đúng định dạng'
    }),
  email: Joi.string().required().email().messages({
    'string.empty': 'Email không được để trống',
    'any.required': 'Email là bắt buộc',
    'string.email': 'Email không đúng định dạng'
  })
})

export const changePasswordValid = Joi.object({
  password: Joi.string().required().min(6).messages({
    'string.empty': 'Mật khẩu không được để trống',
    'any.required': 'Mật khẩu là bắt buộc',
    'string.min': 'Mật khẩu phải có ít nhất {#limit} ký tự'
  }),
  confirm_password: Joi.string().required().valid(Joi.ref('password')).messages({
    'string.empty': 'Mật khẩu xác nhận không được để trống',
    'any.required': 'Mật khẩu xác nhận là bắt buộc',
    'any.only': 'Mật khẩu xác nhận phải trùng với mật khẩu'
  })
})

export const changeEmailValid = Joi.object({
  email: Joi.string().required().email().messages({
    'string.empty': 'Email không được để trống',
    'any.required': 'Email là bắt buộc',
    'string.email': 'Email không đúng định dạng'
  }),

  new_email: Joi.string().required().email().not(Joi.ref('email')).messages({
    'string.empty': 'Email mới không được để trống',
    'any.required': 'Email mới là bắt buộc',
    'string.email': 'Email mới không đúng định dạng',
    'any.invalid': 'Email mới phải khác với email hiện tại'
  })
})
