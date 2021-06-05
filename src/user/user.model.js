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
  hashed_password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  role: {
    type: String,
    defaut: 'user',
    enum: [ 'user', 'supervisor', 'admin' ]
  },
  history: {
    type: Array,
    default: []
  }
}, { timestamp: true })

/*
UserSchema.pre(
  'save',
  async function(next) {
    // const user = this
    const saltRounds = 10
    const hash = await bcrypt.hash(this.password, saltRounds)
    this.password = hash
    next()
  }
)
*/

UserSchema.virtual('password')
  .set(function(password) {
    this._password = password
    const saltRounds = 10
    this.hashed_password = bcrypt.hashSync(password, saltRounds)
  })
  .get(function() {
    // return this._password
    return this.hashed_password
  })

UserSchema.methodsisValidPassword = async (password) => bcrypt.compare(password, this.password)

const User = mongoose.model('user', UserSchema)

export default User
