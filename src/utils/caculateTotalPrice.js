import Version from '~/models/version.model.js'

export const caculateTotalPriceAfterPopulate = async (cart) => {
  let total_price = 0
  cart.cart_items.forEach((item) => {
    total_price += item.quantity * item.version.current_price
  })
  return total_price
}

export const caculateTotalPrice = async (cart) => {
  const versions = await Version.find({ _id: { $in: cart.cart_items.map((item) => item.version) } })
  let total_price = 0

  cart.cart_items.forEach((item) => {
    let version = versions.find((p) => p._id == item.version.toString())
    total_price += version.current_price * item.quantity
  })

  return total_price
}
