import crypto from 'crypto'

const {
  BUILD_MODE,
  URL_CLIENT,
  URL_CLIENT_DEPLOY,
  URL_API_DEPLOY,
  IPN_URL_MOMO_NGROK,
  ACCESS_KEY_MOMO,
  SECRET_KEY_MOMO,
  PARTNER_CODE_MOMO
} = process.env

const REDIRECT_URL = BUILD_MODE === 'prod' ? `${URL_CLIENT_DEPLOY}/checkout-success` : `${URL_CLIENT}/checkout-success`
const IPN_URL =
  BUILD_MODE === 'prod'
    ? `${URL_API_DEPLOY}/api/orders/complete-pay-with-momo`
    : `${IPN_URL_MOMO_NGROK}/api/orders/complete-pay-with-momo`

const createOptionsSendToMoMoEndpoint = async (extraDataBase64, total_price) => {
  // https://developers.momo.vn/#/docs/en/aiov2/?id=payment-method
  // Parameters
  var accessKey = ACCESS_KEY_MOMO
  var secretKey = SECRET_KEY_MOMO
  var orderInfo = 'pay with MoMo'
  var partnerCode = PARTNER_CODE_MOMO
  var redirectUrl = REDIRECT_URL
  var ipnUrl = IPN_URL
  var requestType = 'payWithMethod'
  var amount = total_price
  var orderId = partnerCode + new Date().getTime()
  var requestId = orderId
  var extraData = extraDataBase64
  var orderGroupId = ''
  var autoCapture = true
  var lang = 'vi'

  // Before sign HMAC SHA256 with format
  // accessKey=$accessKey&amount=$amount&extraData=$extraData&ipnUrl=$ipnUrl&orderId=$orderId&orderInfo=$orderInfo&partnerCode=$partnerCode&redirectUrl=$redirectUrl&requestId=$requestId&requestType=$requestType
  var rawSignature =
    'accessKey=' +
    accessKey +
    '&amount=' +
    amount +
    '&extraData=' +
    extraData +
    '&ipnUrl=' +
    ipnUrl +
    '&orderId=' +
    orderId +
    '&orderInfo=' +
    orderInfo +
    '&partnerCode=' +
    partnerCode +
    '&redirectUrl=' +
    redirectUrl +
    '&requestId=' +
    requestId +
    '&requestType=' +
    requestType

  // Signature
  var signature = crypto.createHmac('sha256', secretKey).update(rawSignature).digest('hex')

  // JSON object send to MoMo endpoint
  const requestBody = JSON.stringify({
    partnerCode: partnerCode,
    partnerName: 'Test',
    storeId: 'MomoTestStore',
    requestId: requestId,
    amount: amount,
    orderId: orderId,
    orderInfo: orderInfo,
    redirectUrl: redirectUrl,
    ipnUrl: ipnUrl,
    lang: lang,
    requestType: requestType,
    autoCapture: autoCapture,
    extraData: extraData,
    orderGroupId: orderGroupId,
    signature: signature
  })

  // Options for MoMo API request by axios
  const options = {
    method: 'POST',
    url: 'https://test-payment.momo.vn/v2/gateway/api/create',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(requestBody)
    },
    data: requestBody
  }

  return options
}

const createOptionsReceiveTransactionStatus = async (orderId) => {
  const rawSignature = `accessKey=${ACCESS_KEY_MOMO}&orderId=${orderId}&partnerCode=${PARTNER_CODE_MOMO}&requestId=${orderId}`
  const signature = crypto.createHmac('sha256', SECRET_KEY_MOMO).update(rawSignature).digest('hex')

  const requestBody = JSON.stringify({
    partnerCode: PARTNER_CODE_MOMO,
    requestId: orderId,
    orderId: orderId,
    signature: signature,
    lang: 'vi'
  })

  const options = {
    method: 'POST',
    url: 'https://test-payment.momo.vn/v2/gateway/api/query',
    headers: {
      'Content-Type': 'application/json'
    },
    data: requestBody
  }

  return options
}

export default {
  createOptionsSendToMoMoEndpoint,
  createOptionsReceiveTransactionStatus
}
