import mongoose from 'mongoose'

const { ObjectId } = mongoose.Schema

export const cartItemSchema = mongoose.Schema({
  product: {
    type: ObjectId,
    ref: "product",
  },
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  count: {
    type: Number,
    required: true,
  }
}, { timestamps: true })

const CartItem = mongoose.model('cartitem', cartItemSchema)

export default CartItem
