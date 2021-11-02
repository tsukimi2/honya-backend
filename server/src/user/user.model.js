import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import _ from 'lodash'
import DatabaseError from '../errors/DatabaseError.js'
import { ROLE } from './user.constants.js'
/*
import config from '../libs/config/index.js'
import { database } from '../di-container.js'

const dburi = `mongodb://${config.get('db:mongo:host')}:${config.get('db:mongo:port')}/${config.get('db:mongo:schema')}`
const connection = database.getConnection(dburi)

console.log('user model')
console.log('connection')
console.log(connection)
*/
const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    index: {
      unique: true,
      partialFilterExpression: {username: {$type: "string"}}
    },
    minLength: 3,
    maxLength: 20,
  },
  hashedPassword: {
    type: String,
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
    index: {
      unique: true,
      partialFilterExpression: {email: {$type: "string"}}
    }
  },
  googleAccountId: {
    type: Number,
    index: {
      unique: true,
      partialFilterExpression: {googleAccountId: {$type: "number"}}
    }
  },
  googleAccountEmail: {
    type: String,
    index: {
      unique: true,
      partialFilterExpression: {googleAccountEmail: {$type: "string"}}
    }
  },
  role: {
    type: String,
    default: ROLE.USER,
    enum: [ ROLE.USER, ROLE.SUPERVISOR, ROLE.ADMIN ]
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
  /*
  .set(async function(password) {
    this._password = password
    // const saltRounds = config.get('security:password:saltrounds')
    const saltRounds = 10
console.log('saltRounds')
console.log(saltRounds)
    this.hashedPassword = await bcrypt.hash(password, saltRounds)
  })
  */
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

UserSchema.statics.updateLoginHashAndRefreshToken = async function(filterParams, { loginHash=null, lastLoginAt=null, refreshToken=null, refreshTokenExpiresDt=null}) {
  let filter = {...filterParams}
  if(!filter || _.isEmpty(filter)) {
    throw new DatabaseError('Empty filter in updateLoginHashAndRefreshToken()')
  }
  if(filterParams._id && typeof filterParams._id === 'string') {
    filter._id = mongoose.Types.ObjectId(filterParams._id)
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
