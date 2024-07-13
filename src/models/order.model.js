import mongoose from 'mongoose'

const itemSchema = mongoose.Schema({
  version: { type: mongoose.Schema.Types.ObjectId, ref: 'Versions' },
  quantity: { type: Number, default: 0 }
})

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
    items: [itemSchema],
    total_price: { type: Number, default: 0 },
    province: { type: String, default: '' },
    district: { type: String, default: '' },
    ward: { type: String, default: '' },
    shipping_address: { type: String, default: '' },
    status: { type: String, default: 'Chờ xác nhận' },
    payment_method: { type: mongoose.Schema.Types.ObjectId, ref: 'Payment_methods' },
    code: { type: String, default: '' }
  },
  {
    timestamps: true,
    versionKey: false
  }
)

const Order = mongoose.model('Orders', orderSchema)

export default Order
