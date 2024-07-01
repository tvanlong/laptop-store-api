import { isValidObjectId } from 'mongoose'
import Cart from '~/models/cart.model'
import User from '~/models/user.model'
import { caculateTotalPrice, caculateTotalPriceAfterPopulate } from '~/utils/caculateTotalPrice'

const addItemToCart = async (req, res, next) => {
  try {
    let userId = req.params.userId
    let user = await User.exists({ _id: userId })

    if (!userId || !isValidObjectId(userId) || !user) return res.status(400).json({ message: 'User ID không hợp lệ' })

    let versionId = req.body.versionId
    if (!versionId) return res.status(400).json({ message: 'versionId không hợp lệ' })

    let cart = await Cart.findOne({ userId: userId })

    if (cart) {
      // Nếu đã có giỏ hàng trước đó thì kiểm tra xem versionId đã tồn tại trong giỏ hàng chưa
      // Nếu đã tồn tại thì tăng số lượng lên 1, nếu chưa thì thêm mới vào giỏ hàng
      let itemIndex = cart.cart_items.findIndex((item) => item.version == versionId)

      if (itemIndex > -1) {
        let cartItem = cart.cart_items[itemIndex]
        cartItem.quantity += 1
        cart.cart_items[itemIndex] = cartItem
      } else {
        cart.cart_items.push({ version: versionId, quantity: 1 })
      }
      cart.total_price = await caculateTotalPrice(cart)

      cart = await cart.save()
      return res.status(200).json({
        message: 'Thêm vào giỏ hàng thành công',
        data: cart
      })
    } else {
      // Nếu chưa có giỏ hàng thì tạo mới giỏ hàng
      const newCart = await Cart.create({
        userId,
        cart_items: [{ version: versionId, quantity: 1 }]
      })
      newCart.total_price = await caculateTotalPrice(newCart)
      await newCart.save()

      return res.status(201).json({
        message: 'Thêm vào giỏ hàng thành công',
        data: newCart
      })
    }
  } catch (error) {
    next(error)
  }
}

const getCart = async (req, res, next) => {
  try {
    let userId = req.params.userId
    let user = await User.exists({ _id: userId })

    if (!userId || !isValidObjectId(userId) || !user) return res.status(400).json({ message: 'User ID không hợp lệ' })

    let cart = await Cart.findOne({ userId: userId }).populate({
      path: 'cart_items.version',
      options: { withDeleted: true },
      populate: {
        path: 'product'
      }
    })

    if (!cart)
      return res.status(200).json({
        message: 'Không tìm thấy giỏ hàng',
        data: []
      })

    cart.total_price = await caculateTotalPriceAfterPopulate(cart)
    await cart.save()

    res.status(200).json({
      message: 'Lấy giỏ hàng thành công',
      data: cart
    })
  } catch (error) {
    next(error)
  }
}

const increaseQuantity = async (req, res, next) => {
  try {
    let userId = req.params.userId
    let user = await User.exists({ _id: userId })
    let versionId = req.body.versionId

    if (!userId || !isValidObjectId(userId) || !user) return res.status(400).json({ message: 'User ID không hợp lệ' })

    let cart = await Cart.findOne({ userId: userId })
    if (!cart) return res.status(404).json({ message: 'Không tìm thấy giỏ hàng' })

    let itemIndex = cart.cart_items.findIndex((item) => item.version == versionId)

    if (itemIndex > -1) {
      let cartItem = cart.cart_items[itemIndex]
      cartItem.quantity += 1
      cart.cart_items[itemIndex] = cartItem

      cart.total_price = await caculateTotalPrice(cart)

      cart = await cart.save()
      return res.status(200).json({
        message: 'Tăng số lượng thành công',
        data: cart
      })
    }
    res.status(400).json({ message: 'Sản phẩm không tồn tại trong giỏ hàng' })
  } catch (error) {
    next(error)
  }
}

const decreaseQuantity = async (req, res, next) => {
  try {
    let userId = req.params.userId
    let user = await User.exists({ _id: userId })
    let versionId = req.body.versionId

    if (!userId || !isValidObjectId(userId) || !user) return res.status(400).json({ message: 'User ID không hợp lệ' })

    let cart = await Cart.findOne({ userId: userId })
    if (!cart) return res.status(404).json({ message: 'Không tìm thấy giỏ hàng' })

    let itemIndex = cart.cart_items.findIndex((item) => item.version == versionId)

    if (itemIndex > -1) {
      let cartItem = cart.cart_items[itemIndex]
      cartItem.quantity -= 1
      cart.cart_items[itemIndex] = cartItem

      if (cartItem.quantity == 0) {
        cart.cart_items.splice(itemIndex, 1)
      }

      cart.total_price = await caculateTotalPrice(cart)

      cart = await cart.save()
      return res.status(200).json({
        message: 'Giảm số lượng thành công',
        data: cart
      })
    }
    res.status(400).json({ message: 'Sản phẩm không tồn tại trong giỏ hàng' })
  } catch (error) {
    next(error)
  }
}

const updateCartQuantity = async (req, res, next) => {
  try {
    let userId = req.params.userId
    let user = await User.exists({ _id: userId })
    let versionId = req.body.versionId
    let quantity = req.body.quantity

    if (!userId || !isValidObjectId(userId) || !user) return res.status(400).json({ message: 'User ID không hợp lệ' })

    let cart = await Cart.findOne({ userId: userId })
    if (!cart) return res.status(404).json({ message: 'Không tìm thấy giỏ hàng' })

    let itemIndex = cart.cart_items.findIndex((item) => item.version == versionId)

    if (itemIndex > -1) {
      let cartItem = cart.cart_items[itemIndex]
      cartItem.quantity = quantity
      cart.cart_items[itemIndex] = cartItem

      if (cartItem.quantity == 0) {
        cart.cart_items.splice(itemIndex, 1)
      }

      cart.total_price = await caculateTotalPrice(cart)

      cart = await cart.save()
      return res.status(200).json({
        message: 'Cập nhật số lượng thành công',
        data: cart
      })
    }
    res.status(400).json({ message: 'Sản phẩm không tồn tại trong giỏ hàng' })
  } catch (error) {
    next(error)
  }
}

const removeItem = async (req, res, next) => {
  try {
    let userId = req.params.userId
    let versionId = req.body.versionId
    let user = await User.exists({ _id: userId })

    if (!userId || !isValidObjectId(userId) || !user) return res.status(400).json({ message: 'User ID không hợp lệ' })

    let cart = await Cart.findOne({ userId: userId })
    if (!cart) return res.status(404).json({ message: 'Không tìm thấy giỏ hàng' })

    let itemIndex = cart.cart_items.findIndex((item) => item.version == versionId)
    if (itemIndex > -1) {
      cart.cart_items.splice(itemIndex, 1)
      cart.total_price = await caculateTotalPrice(cart)

      if (cart.cart_items.length === 0) {
        await Cart.deleteOne({ userId: userId })
        return res.status(200).json({ message: 'Giỏ hàng trống' })
      }

      cart = await cart.save()
      return res.status(200).json({ message: 'Xóa sản phẩm thành công', data: cart })
    }
    res.status(400).json({ message: 'Sản phẩm không tồn tại trong giỏ hàng' })
  } catch (error) {
    next(error)
  }
}

const removeCart = async (req, res, next) => {
  try {
    let userId = req.params.userId
    let user = await User.exists({ _id: userId })

    if (!userId || !isValidObjectId(userId) || !user) return res.status(400).json({ message: 'User ID không hợp lệ' })

    let cart = await Cart.findOne({ userId: userId })
    if (!cart) return res.status(404).json({ message: 'Không tìm thấy giỏ hàng' })

    await Cart.deleteOne({ userId: userId })
    res.status(200).json({ message: 'Xóa giỏ hàng thành công' })
  } catch (error) {
    next(error)
  }
}

export default {
  addItemToCart,
  getCart,
  increaseQuantity,
  decreaseQuantity,
  updateCartQuantity,
  removeItem,
  removeCart
}
