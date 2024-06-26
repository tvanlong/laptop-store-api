import mongoose from 'mongoose'

const otpSchema = new mongoose.Schema({
  email: { type: String, required: true },
  otp: { type: String, required: true }
})

const OTPs = mongoose.model('OTPs', otpSchema)

export default OTPs
