import mongoose from 'mongoose'
import { cartItemSchema } from './cartItem.model.js'

const { ObjectId } = mongoose.Schema

const orderSchema = mongoose.Schema({
  products: [cartItemSchema],
  transaction_id: {},
  amount: {
    type: Number,
    required: true,
  },
  address: {
    type: String,
    required: true,
    trim: true,
  },
  status: {
    type: String,
    default: 'Not processed',
    enum: ["Not processed", "Processing", "Shipped", "Delivered", "Cancelled"]
  },
  updated: Date,
  user: {
    type: ObjectId,
    ref: 'user'
  }
}, { timestamps: true })

const Order = mongoose.model('order', orderSchema)

export default Order
