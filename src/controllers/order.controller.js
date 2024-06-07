import axios from 'axios'
import Cart from '~/models/cart.model'
import Order from '~/models/order.model'
import orderService from '~/services/order.service'
import { decodeBase64ToJson, encodeJsonToBase64 } from '~/utils/base64Utils'
import { caculateTotalPrice } from '~/utils/caculateTotalPrice'

const createOrderCheckout = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId })
    if (!cart) return res.status(404).json({ message: 'Không tìm thấy giỏ hàng' })

    const total_price = await caculateTotalPrice(cart)

    const order = await Order.create({
      user: req.params.userId,
      items: cart.cart_items.map((item) => ({
        version: item.version,
        quantity: item.quantity
      })),
      total_price,
      shipping_address: req.body.shipping_address,
      payment_method: req.body.payment_method
    })

    await Cart.deleteOne({ userId: req.params.userId })

    return res.status(201).json({
      message: 'Dặt hàng thành công',
      data: order
    })
  } catch (error) {
    next(error)
  }
}

const createPaymentWithMomo = async (req, res) => {
  const cart = await Cart.findOne({ userId: req.query.user_id })
  if (!cart) return res.status(404).json({ message: 'Không tìm thấy giỏ hàng' })
  const total_price = await caculateTotalPrice(cart)

  const extraDataBase64 = encodeJsonToBase64({
    user: req.query.user_id,
    items: cart.cart_items.map((item) => ({
      version: item.version,
      quantity: item.quantity
    })),
    total_price,
    shipping_address: req.body.shipping_address,
    payment_method: req.body.payment_method
  })
  const options = await orderService.createOptionsSendToMoMoEndpoint(extraDataBase64, total_price)

  // Call MoMo API
  let result
  try {
    result = await axios(options)
    return res.status(200).json(result.data)
  } catch (error) {
    return res.status(500).json({ message: 'Error while calling MoMo API' })
  }
}

const completePaymentWithMomo = async (req, res, next) => {
  try {
    console.log('Payment completed!')
    console.log(req.body)
    console.log('extraData: ', decodeBase64ToJson(req.body.extraData))
    return res.status(200).json(req.body)
  } catch (error) {
    next(error)
  }
}

const receiveTransactionStatus = async (req, res, next) => {
  try {
    const { orderId } = req.body
    const options = await orderService.createOptionsReceiveTransactionStatus(orderId)

    const result = await axios(options)
    return res.status(200).json(result.data)
  } catch (error) {
    next(error)
  }
}

const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findOne({ user: req.params.userId, _id: req.params.orderId }).populate({
      path: 'user',
      select: 'name email'
    })
    if (!order) return res.status(404).json({ message: 'Không tìm thấy đơn hàng' })

    return res.status(200).json({
      message: 'Lấy thông tin đơn hàng thành công',
      data: order
    })
  } catch (error) {
    next(error)
  }
}

const getOrdersByUserId = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.params.userId }).populate({
      path: 'items.version',
      populate: {
        path: 'product'
      }
    })
    if (!orders) return res.status(404).json({ message: 'Không tìm thấy đơn hàng' })

    return res.status(200).json({
      message: 'Lấy thông tin đơn hàng thành công',
      data: orders
    })
  } catch (error) {
    next(error)
  }
}

const getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find()
      .populate({
        path: 'user',
        select: 'name email'
      })
      .populate({
        path: 'items.version',
        populate: {
          path: 'product'
        }
      })
    if (!orders) return res.status(404).json({ message: 'Không tìm thấy đơn hàng' })

    return res.status(200).json({
      message: 'Lấy thông tin đơn hàng thành công',
      data: orders
    })
  } catch (error) {
    next(error)
  }
}

const updateStatusOrder = async (req, res, next) => {
  try {
    const order = await Order.findOne({ user: req.params.userId, _id: req.params.orderId })
    if (!order) return res.status(404).json({ message: 'Không tìm thấy đơn hàng' })

    order.status = req.body.status
    await order.save()

    return res.status(200).json({
      message: 'Cập nhật trạng thái đơn hàng thành công',
      data: order
    })
  } catch (error) {
    next(error)
  }
}

export default {
  createOrderCheckout,
  getOrderById,
  getOrdersByUserId,
  getAllOrders,
  updateStatusOrder,
  createPaymentWithMomo,
  completePaymentWithMomo,
  receiveTransactionStatus
}
