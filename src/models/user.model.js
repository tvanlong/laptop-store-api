import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, minLength: 6 },
    phone: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minLength: 6 },
    role: { type: String, default: 'member' },
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

const User = mongoose.model('Users', userSchema)

export default User
