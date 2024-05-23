import Cart from '~/models/cart.model.js'
import Order from '~/models/order.model.js'
import Version from '~/models/version.model.js'

export const createOrderCheckout = async (req, res) => {
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
      shipping_address: req.body.shipping_address
    })

    await Cart.deleteOne({ userId: req.params.userId })

    return res.status(201).json({
      message: 'Dặt hàng thành công',
      data: order
    })
  } catch (error) {
    return res.status(500).json({
      name: error.name,
      message: error.message
    })
  }
}

export const getOrderById = async (req, res) => {
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
    return res.status(500).json({
      name: error.name,
      message: error.message
    })
  }
}

export const getOrdersByUserId = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.params.userId })
    if (!orders) return res.status(404).json({ message: 'Không tìm thấy đơn hàng' })

    return res.status(200).json({
      message: 'Lấy thông tin đơn hàng thành công',
      data: orders
    })
  } catch (error) {
    return res.status(500).json({
      name: error.name,
      message: error.message
    })
  }
}

export const getAllOrders = async (req, res) => {
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
    return res.status(500).json({
      name: error.name,
      message: error.message
    })
  }
}

export const updateStatusOrder = async (req, res) => {
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
    return res.status(500).json({
      name: error.name,
      message: error.message
    })
  }
}

const caculateTotalPrice = async (cart) => {
  const versions = await Version.find({ _id: { $in: cart.cart_items.map((item) => item.version) } })
  let total_price = 0

  cart.cart_items.forEach((item) => {
    let version = versions.find((p) => p._id == item.version.toString())
    total_price += version.current_price * item.quantity
  })

  return total_price
}
