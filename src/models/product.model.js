import mongoose from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, minLength: 3 },
    images: [{ type: String, required: true }], // Array of image URLs.Example: ['https://example.com/image1.jpg', 'https://example.com/image2.jpg']
    subcategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subcategories',
      required: true
    },
    versions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Versions'
      }
    ]
  },
  {
    timestamps: true,
    versionKey: false
  }
)

productSchema.plugin(mongoosePaginate)

const Product = mongoose.model('Products', productSchema)

Product.paginate().then({})

export default Product
