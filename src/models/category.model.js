import mongoose from 'mongoose'

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, default: 'Uncategorized', minLength: 6 },
    subcategories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subcategories'
      }
    ]
  },
  {
    timestamps: true,
    versionKey: false
  }
)

const Category = mongoose.model('Categories', categorySchema)

export default Category
