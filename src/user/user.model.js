import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import _ from 'lodash'
import DatabaseError from '../errors/DatabaseError.js'

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
    // return this._password
  })

UserSchema.path('hashedPassword').validate(function(v) {
  if(!this._password) {
    this.invalidate('password', 'required', '', 'required')
  }
  if(this._password.length < 8) {
    this.invalidate('password', 'min length should be 8', '', 'minlength')
  }
  if(this._password.length > 20) {
    this.invalidate('password', 'max length should be 20', '', 'maxlength')
  }
})

UserSchema.methods.isValidPassword = async function(password) {
  const user = this
  return bcrypt.compare(password, user.hashedPassword)
}

UserSchema.path('email').validate(function (email) {
  const emailRegex = /^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/;
  const result = emailRegex.test(email); // Assuming email has a text attribute

  if(!result) {
    this.invalidate('email', 'invalid email format', email, 'invalidEmailFormat')
  }
})

UserSchema.statics.updateLoginHashAndRefreshToken = async function(filterParam, { loginHash=null, lastLoginAt=null, refreshToken=null, refreshTokenExpiresDt=null}) {
  let filter = {...filterParam}
  if(!filter || _.isEmpty(filter)) {
    throw new DatabaseError('Empty filter in updateLoginHashAndRefreshToken()')
  }
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
