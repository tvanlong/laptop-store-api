import randomstring from 'randomstring'

export const generateOTP = () => {
  return randomstring.generate({ length: 6, charset: 'numeric' })
}
