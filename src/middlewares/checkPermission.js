import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'
import User from '~/models/user.model'

dotenv.config()

export const checkPermission = (...roles) => {
  return async (req, res, next) => {
    try {
      let token

      // Lặp qua các vai trò để tìm token tương ứng
      for (const role of roles) {
        if (role === 'admin' && req.cookies.access_token_admin) {
          token = req.cookies.access_token_admin
          break
        } else if (role === 'staff' && req.cookies.access_token_staff) {
          token = req.cookies.access_token_staff
          break
        } else if (role === 'member' && req.cookies.access_token_member) {
          token = req.cookies.access_token_member
          break
        }
      }

      // Kiểm tra token có hợp lệ không
      if (!token) {
        return res.status(401).json({ message: 'Bạn chưa đăng nhập!' })
      }

      // Kiểm tra quyền của người dùng
      const decoded = jwt.verify(token, process.env.JWT_ACCESS_TOKEN)
      const user = await User.findById(decoded._id)
      if (!user) {
        return res.status(404).json({ message: 'Người dùng không tồn tại!' })
      }

      // Kiểm tra xem vai trò của người dùng có trong danh sách các vai trò cho phép không
      if (!roles.includes(user.role)) {
        return res.status(403).json({ message: 'Bạn không có quyền thực hiện hành động này!' })
      }

      // Nếu có quyền thì cho phép thực hiện hành động tiếp theo
      next()
    } catch (error) {
      return res.status(500).json({ message: error.message })
    }
  }
}
