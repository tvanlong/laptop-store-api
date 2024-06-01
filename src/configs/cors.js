import dotenv from 'dotenv'

dotenv.config()

const WHITELIST_DOMAINS = [process.env.URL_CLIENT_DEPLOY, process.env.URL_ADMIN_DEPLOY]

// Cấu hình CORS Option
export const corsOptions = {
  origin: function (origin, callback) {
    console.log(`Origin: ${origin}`) // Debugging line

    // Nếu đang ở trong môi trường dev thì cho phép tất cả các domain
    if (process.env.BUILD_MODE === 'dev') {
      return callback(null, true)
    }

    // Kiểm tra xem origin có phải là domain được chấp nhận hay không
    if (WHITELIST_DOMAINS.includes(origin)) {
      return callback(null, true)
    }

    // Cuối cùng nếu domain không được chấp nhận thì trả về lỗi
    return callback(new Error('Not allowed by CORS'))
  },

  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  preflightContinue: false,

  // Some legacy browsers (IE11, various SmartTVs) choke on 204
  optionsSuccessStatus: 200,

  // CORS sẽ cho phép nhận cookies từ request
  credentials: true
}
