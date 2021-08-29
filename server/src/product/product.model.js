import mongoose from 'mongoose'

const { ObjectId } = mongoose.Schema

const productSchema = mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true,
    maxlength: 80
  },
  description: {
    type: String,
    maxlength: 200
  },
  price: {
    type: Number,
    trim: true,
    required: true,
    maxlength: 32
  },
  category: {
    type: ObjectId,
    ref: "category",
    required: true
  },
  quantity: {
    type: Number
  },
  sold: {
    type: Number,
    default: 0
  },
  photo: {
    data: Buffer,
    contentType: String
  },
  shipping: {
    required: false,
    type: Boolean
  }
},  { timestamps: true })

const Product = mongoose.model('product', productSchema)

export default Product
