import mongoose from 'mongoose'

const subcategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, default: 'Unsubcategorized', minLength: 6 },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Categories',
      required: true
    },
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Products'
      }
    ]
  },
  {
    timestamps: true,
    versionKey: false
  }
)

const Subcategory = mongoose.model('Subcategories', subcategorySchema)

export default Subcategory
