import _ from 'lodash'
import ApplicationError from '../errors/ApplicationError.js'
import DatabaseError from '../errors/DatabaseError.js'
import Repos from '../repos/index.js'

export default class CategoryRepos extends Repos {
  constructor(model) {
    super(model)
  }
}