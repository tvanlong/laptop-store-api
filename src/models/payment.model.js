import mongoose from 'mongoose'

const paymentMethodSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, minLength: 6 }
})

const Payment_method = mongoose.model('Payment_methods', paymentMethodSchema)

export default Payment_method
