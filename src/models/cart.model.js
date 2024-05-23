import mongoose from 'mongoose'

const itemSchema = mongoose.Schema({
  version: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Versions'
  },
  quantity: {
    type: Number,
    default: 0
  }
})

const cartSchema = new mongoose.Schema({
  cart_items: [itemSchema],
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
  total_price: { type: Number, default: 0 }
})

const Cart = mongoose.model('Carts', cartSchema)

export default Cart
