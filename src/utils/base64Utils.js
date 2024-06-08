export const encodeJsonToBase64 = (jsonObject) => {
  // Chuyển đổi đối tượng JSON thành chuỗi
  let jsonString = JSON.stringify(jsonObject)

  // Mã hóa chuỗi đó bằng base64 sử dụng Buffer
  let base64Data = Buffer.from(jsonString).toString('base64')

  return base64Data
}

export const decodeBase64ToJson = (base64String) => {
  // Giải mã chuỗi base64 thành chuỗi UTF-8
  let jsonString = Buffer.from(base64String, 'base64').toString('utf-8')

  // Phân tích chuỗi JSON thành đối tượng JavaScript
  let jsonObject = JSON.parse(jsonString)

  return jsonObject
}
