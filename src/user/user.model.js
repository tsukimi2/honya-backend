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
  hashedPassword: {
    type: String,
    required: true,
  },
  /*
  loginHash: {
    type: String,
    required: false,
    index: {
      unique: true,
      partialFilterExpression: { loginHash: { $type: 'string' } },
    },
    default: null,
  },
  */
  loginHash: {
    type: String,
    trim: true,
    index: {
      unique: true,
      partialFilterExpression: {loginHash: {$type: "string"}}
    }
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
  },
  lastLoginAt: {
    type: Date,
    default: new Date(0)
  },
  refreshToken: {
    type: String,
    default: null,
  },
  refreshTokenExpiresDt: {
    type: Date,
    default: null,
  }
}, { timestamp: true })

UserSchema.virtual('hashed_uid')


UserSchema.virtual('password')
  .set(function(password) {
    this._password = password
    const saltRounds = 10
    this.hashedPassword = bcrypt.hashSync(password, saltRounds)
  })
  .get(function() {
    return this.hashedPassword
  })

UserSchema.methods.isValidPassword = async function(password) {
  const user = this
  return bcrypt.compare(password, user.hashedPassword)
}

UserSchema.statics.updateLoginHashAndRefreshToken = async function(filterParam, { loginHash=null, lastLoginAt=null, refreshToken=null, refreshTokenExpiresDt=null}) {
  let filter = {...filterParam}
  if(filterParam._id && typeof filterParam._id === 'string') {
    filter._id = mongoose.Types.ObjectId(filterParam._id)
  }
  
  let update = {
    loginHash,
    refreshToken,
    refreshTokenExpiresDt
  }
  if(lastLoginAt) {
    update['lastLoginAt'] = lastLoginAt
  }

  return this.findOneAndUpdate(filter, update, { new: true })
}

const User = mongoose.model('user', UserSchema)

export default User
