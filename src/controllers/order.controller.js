import axios from 'axios'
import CryptoJS from 'crypto-js'
import moment from 'moment'
import { config } from '~/constants/zalopayConfig'
import Cart from '~/models/cart.model'
import Order from '~/models/order.model'
import orderService from '~/services/order.service'
import { decodeBase64ToJson, encodeJsonToBase64 } from '~/utils/base64Utils'
import { caculateTotalPrice } from '~/utils/caculateTotalPrice'

// Create order checkout with payment method is COD
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

// Create order checkout with payment method is MoMo
const createPaymentWithMomo = async (req, res) => {
  const cart = await Cart.findOne({ userId: req.params.userId })
  if (!cart) return res.status(404).json({ message: 'Không tìm thấy giỏ hàng' })
  const total_price = await caculateTotalPrice(cart)

  const extraDataBase64 = encodeJsonToBase64({
    user: req.params.userId,
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
    const responsePayment = req.body
    const data = decodeBase64ToJson(responsePayment.extraData)
    if (responsePayment.resultCode !== 0) {
      return res.status(400).json({ message: 'Thanh toán không thành công' })
    }

    await Order.create({
      user: data.user,
      items: data.items,
      total_price: data.total_price,
      shipping_address: data.shipping_address,
      payment_method: data.payment_method
    })

    await Cart.deleteOne({ userId: data.user })

    return res.status(201).json({ message: 'Thanh toán thành công' })
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
// ------------------------------------------------

// Create order checkout with payment method is ZaloPay
const createPaymentWithZaloPay = async (req, res) => {
  const config = {
    app_id: process.env.ZALOPAY_APP_ID,
    key1: process.env.ZALOPAY_KEY1,
    key2: process.env.ZALOPAY_KEY2,
    endpoint: process.env.ZALOPAY_ENDPOINT
  }

  const embed_data = {
    redirectURL: 'https://pcrender.com'
  }

  const items = [{}]
  const transID = Math.floor(Math.random() * 1000000)
  const order = {
    app_id: config.app_id,
    app_trans_id: `${moment().format('YYMMDD')}_${transID}`, // translation missing: vi.docs.shared.sample_code.comments.app_trans_id
    app_user: 'user123',
    app_time: Date.now(), // miliseconds
    item: JSON.stringify(items),
    embed_data: JSON.stringify(embed_data),
    amount: 50000,
    description: `Lazada - Payment for the order #${transID}`,
    bank_code: '',
    callback_url:
      'https://2731-2405-4802-1f93-b490-b5a4-b3cb-4b20-6c00.ngrok-free.app/api/orders/complete-pay-with-zalopay'
  }

  // appid|app_trans_id|appuser|amount|apptime|embeddata|item
  const data =
    config.app_id +
    '|' +
    order.app_trans_id +
    '|' +
    order.app_user +
    '|' +
    order.amount +
    '|' +
    order.app_time +
    '|' +
    order.embed_data +
    '|' +
    order.item
  order.mac = CryptoJS.HmacSHA256(data, config.key1).toString()

  try {
    const result = await axios.post(config.endpoint, null, { params: order })

    return res.status(200).json(result.data)
  } catch (error) {
    return res.status(500).json({ message: 'Error while calling ZaloPay API', error })
  }
}

const completePaymentWithZaloPay = async (req, res) => {
  let result = {}

  try {
    let dataStr = req.body.data
    let reqMac = req.body.mac

    let mac = CryptoJS.HmacSHA256(dataStr, config.key2).toString()
    console.log('mac =', mac)

    // kiểm tra callback hợp lệ (đến từ ZaloPay server)
    if (reqMac !== mac) {
      // callback không hợp lệ
      result.return_code = -1
      result.return_message = 'mac not equal'
    } else {
      // thanh toán thành công
      // merchant cập nhật trạng thái cho đơn hàng
      let dataJson = JSON.parse(dataStr, config.key2)
      // eslint-disable-next-line quotes
      console.log("update order's status = success where app_trans_id =", dataJson['app_trans_id'])

      result.return_code = 1
      result.return_message = 'success'
    }
  } catch (ex) {
    result.return_code = 0 // ZaloPay server sẽ callback lại (tối đa 3 lần)
    result.return_message = ex.message
  }

  // thông báo kết quả cho ZaloPay server
  res.json(result)
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
  createPaymentWithMomo,
  completePaymentWithMomo,
  receiveTransactionStatus,
  createPaymentWithZaloPay,
  completePaymentWithZaloPay,
  getOrderById,
  getOrdersByUserId,
  getAllOrders,
  updateStatusOrder
}
