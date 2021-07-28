import mongoose from 'mongoose'

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 32,
    unique: true,
  }
}, { timestamps: true })

const Category = mongoose.model('category', categorySchema)

export default Category
