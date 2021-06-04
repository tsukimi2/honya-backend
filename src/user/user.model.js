import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minLength: 3,
    maxLength: 20,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
})

UserSchema.pre(
  'save',
  async function(next) {
    console.log('User pre save')
    // const user = this
    const saltRounds = 10
    const hash = await bcrypt.hash(this.password, saltRounds)
    this.password = hash
    next()
  }
)

UserSchema.methodsisValidPassword = async (password) => bcrypt.compare(password, this.password)

const User = mongoose.model('user', UserSchema)

export default User
