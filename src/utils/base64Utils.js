export const encodeJsonToBase64 = (jsonObject) => {
  // Chuyển đổi đối tượng JSON thành chuỗi
  let jsonString = JSON.stringify(jsonObject)

  // Mã hóa chuỗi đó bằng base64
  let base64Data = btoa(jsonString)

  return base64Data
}

export const decodeBase64ToJson = (base64String) => {
  // Giải mã chuỗi base64 thành chuỗi JSON
  let jsonString = atob(base64String)

  // Phân tích chuỗi JSON thành đối tượng JavaScript
  let jsonObject = JSON.parse(jsonString)

  return jsonObject
}
