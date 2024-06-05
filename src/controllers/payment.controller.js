/* eslint-disable no-unused-vars */
import axios from 'axios'
import crypto from 'crypto'

const { BUILD_MODE, URL_CLIENT, URL_CLIENT_DEPLOY, URL_API_DEPLOY } = process.env

const REDIRECT_URL = BUILD_MODE === 'prod' ? URL_CLIENT_DEPLOY : URL_CLIENT
const IPN_URL =
  BUILD_MODE === 'prod'
    ? `${URL_API_DEPLOY}/api/payment/momo/complete`
    : 'https://3ffe-2405-4802-1f93-b490-1ce3-be6c-cf93-e48d.ngrok-free.app/api/payment/momo/complete'

const ACCESS_KEY = 'F8BBA842ECF85'
const SECRET_KEY = 'K951B6PE1waDMi640xX08PD3vg6EkVlz'
const PARTNER_CODE = 'MOMO'

const createPaymentWithMomo = async (req, res) => {
  // https://developers.momo.vn/#/docs/en/aiov2/?id=payment-method
  // Parameters
  var accessKey = ACCESS_KEY
  var secretKey = SECRET_KEY
  var orderInfo = 'pay with MoMo'
  var partnerCode = PARTNER_CODE
  var redirectUrl = REDIRECT_URL
  var ipnUrl = IPN_URL
  var requestType = 'payWithMethod'
  var amount = '10000'
  var orderId = partnerCode + new Date().getTime()
  var requestId = orderId
  var extraData = ''
  var paymentCode =
    'T8Qii53fAXyUftPV3m9ysyRhEanUs9KlOPfHgpMR0ON50U10Bh+vZdpJU7VY4z+Z2y77fJHkoDc69scwwzLuW5MzeUKTwPo3ZMaB29imm6YulqnWfTkgzqRaion+EuD7FN9wZ4aXE1+mRt0gHsU193y+yxtRgpmY7SDMU9hCKoQtYyHsfFR5FUAOAKMdw2fzQqpToei3rnaYvZuYaxolprm9+/+WIETnPUDlxCYOiw7vPeaaYQQH0BF0TxyU3zu36ODx980rJvPAgtJzH1gUrlxcSS1HQeQ9ZaVM1eOK/jl8KJm6ijOwErHGbgf/hVymUQG65rHU2MWz9U8QUjvDWA=='
  var orderGroupId = ''
  var autoCapture = true
  var lang = 'vi'

  //before sign HMAC SHA256 with format
  //accessKey=$accessKey&amount=$amount&extraData=$extraData&ipnUrl=$ipnUrl&orderId=$orderId&orderInfo=$orderInfo&partnerCode=$partnerCode&redirectUrl=$redirectUrl&requestId=$requestId&requestType=$requestType
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
    return res.status(200).json(req.body)
  } catch (error) {
    next(error)
  }
}

const receiveTransactionStatus = async (req, res, next) => {
  try {
    const { orderId } = req.body
    const rawSignature = `accessKey=${ACCESS_KEY}&orderId=${orderId}&partnerCode=${PARTNER_CODE}&requestId=${orderId}`
    const signature = crypto.createHmac('sha256', SECRET_KEY).update(rawSignature).digest('hex')

    const requestBody = JSON.stringify({
      partnerCode: PARTNER_CODE,
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

    const result = await axios(options)
    return res.status(200).json(result.data)
  } catch (error) {
    next(error)
  }
}

export default {
  createPaymentWithMomo,
  completePaymentWithMomo,
  receiveTransactionStatus
}
