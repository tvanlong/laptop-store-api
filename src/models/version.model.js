import mongoose from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'

const versionSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, minLength: 3 },
    old_price: { type: Number, required: true, min: 100 },
    current_price: { type: Number, required: true, min: 100 },
    description: [{ type: String, required: true, minLength: 3 }],
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Products', required: true },
    status: { type: String, required: true }
  },
  {
    timestamps: true,
    versionKey: false
  }
)

versionSchema.plugin(mongoosePaginate)

const Version = mongoose.model('Versions', versionSchema)

Version.paginate().then({})

export default Version
