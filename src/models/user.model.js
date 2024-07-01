import mongoose from 'mongoose'
import mongooseDelete from 'mongoose-delete'
import { DEFAULT_AVATAR, DEFAULT_ROLE } from '~/constants/defaultVariables'

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, minLength: 6 },
    avatar: {
      type: String,
      default: DEFAULT_AVATAR
    },
    phone: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minLength: 6 },
    role: { type: String, default: DEFAULT_ROLE },
    orders: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Orders'
      }
    ]
  },
  {
    timestamps: true,
    versionKey: false
  }
)

userSchema.plugin(mongooseDelete, {
  deletedAt: true,
  overrideMethods: 'all'
})

const User = mongoose.model('Users', userSchema)

export default User
