import _ from 'lodash'
import ApplicationError from '../errors/ApplicationError.js'
import DatabaseError from '../errors/DatabaseError.js'
import NotFoundError from '../errors/NotFoundError.js'

export default class Repos {
  constructor(model) {
    this.model = model
  }

  async getById(id, opts={}) {  
    if(!id) {
      throw new ApplicationError('Invalid document id')
    }

    let doc = null
    let arrSort = []

    try {
      let query = this.model.findById(id)

      if(opts.populatePath) {
        if(!opts.populateSelect) {
          query.populate(opts.populatePath)
        } else {
          query.populate(opts.populatePath, opts.populateSelect)
        }
      }
      if(opts.selectParams) {
        query.select(opts.selectParams)
      }
      if(opts.sortBy) {
        arrSort = await this.createSortArray(opts.sortBy, opts.order)
      }
      if(arrSort.length !== 0) {      
        query.sort(arrSort)
      }
      if(opts.skip) {
        query.skip(opts.skip)
      }
      if(opts.limit > 0) {
        query.limit(opts.limit)
      }
      if(opts.lean) {
        doc = await query.lean()
      } else {
        doc = await query.exec()
      }
    } catch(err) {
      throw new DatabaseError('cannot find document', { err })
    }

    return doc
  }

  async getOne(filterParams={}, opts={}) {  
    let doc = null
    let arrSort = []

    try {
      let query = this.model.findOne(filterParams)

      if(opts.populatePath) {
        if(!opts.populateSelect) {
          query.populate(opts.populatePath)
        } else {
          query.populate(opts.populatePath, opts.populateSelect)
        }
      }
      if(opts.selectParams) {
        query.select(opts.selectParams)
      }
      if(opts.sortBy) {
        arrSort = await this.createSortArray(opts.sortBy, opts.order)
      }     
      if(arrSort.length !== 0) {      
        query.sort(arrSort)
      }
      if(opts.skip) {
        query.skip(opts.skip)
      }
      if(opts.limit > 0) {
        query.limit(opts.limit)
      }
      if(opts.lean) {
        doc = await query.lean()
      } else {
        doc = await query.exec()
      }      
    } catch(err) {
      throw new DatabaseError('cannot find document', { err })
    }

    return doc
  }

  async get(filterParams={}, opts={}) {    
    let docs = null
    let arrSort = []

    try {    
      let query = this.model.find(filterParams)
      
      if(opts.populatePath) {
        if(!opts.populateSelect) {
          query.populate(opts.populatePath)
        } else {
          query.populate(opts.populatePath, opts.populateSelect)
        }
      }
      if(opts.selectParams) {
        query.select(opts.selectParams)
      }
      if(opts.sortBy) {
        arrSort = await this.createSortArray(opts.sortBy, opts.order)
      }
      if(arrSort.length !== 0) {      
        query.sort(arrSort)
      }
      if(opts.skip) {
        query.skip(opts.skip)
      }
      if(opts.limit > 0) {
        query.limit(opts.limit)
      }
      if(opts.count) {
        docs = await query.count()
      } else {
        if(opts.lean) {
          docs = await query.lean()
        } else {
          docs = await query.exec()
        }
      }
    } catch(err) {
      throw new DatabaseError('cannot find documents', { err })
    }

    return docs
  }

  async create(params) {
    if(!params || _.isEmpty(params)) {
      throw new ApplicationError('Invalid repos create params')
    }

    let doc = null
    try {
      doc = new this.model
      for (const [key, value] of Object.entries(params)) {
        doc[key] = value
      }

      await doc.save()      
    } catch(err) {
      throw new DatabaseError('DatabaseError', { err })
    }

    return doc
  }

  async updateOne(filterParams, updateParams) {
    if(!filterParams || _.isEmpty(filterParams)) {
      throw new ApplicationError('Invalid repos create params')
    }

    let doc = null
    try {
      doc = await this.getOne(filterParams)
    } catch(err) {
      throw new DatabaseError('DatabaseError', { err })
    }

    if(!doc) {
      throw new NotFoundError('document to update is not found')
    }

    try {
      doc = _.extend(doc, updateParams)
      await doc.save()
    } catch(err) {
      throw new DatabaseError('DatabaseError', { err })
    }

    return doc
  }

  async findOneAndUpdate(filterParams, updateParams, opts={}) {
    if(!filterParams || _.isEmpty(filterParams) || !updateParams || _.isEmpty(updateParams)) {
      throw new ApplicationError('Invalid filter or update params')
    }

    try {
      return this.model.findOneAndUpdate(filterParams, updateParams, opts)
    } catch(err) {
      throw new DatabaseError('DatabaseError', { err })
    }
  }

  async deleteOne(filterParams) {
    let result = null

    if(!filterParams || _.isEmpty(filterParams)) {
      throw new ApplicationError('empty filter params when deleting doc')
    }

    try {
      result = await this.model.deleteOne(filterParams)
    } catch(err) { 
      throw new DatabaseError('failed to delete doc', { err })
    }

    return result
  }

  async createSortArray(sortBy, order) {  
    let arrSort = []
    let arrSortBy = []
    let arrOrder = []
    let i = 0
    const DEFAULT_ORDER_VAL = 1
    let sOrder = ''

    if(!sortBy) {    
      return arrSort
    }
    if(sortBy && !Array.isArray(sortBy)) {
      arrSortBy = sortBy.split(',')
    }   
    if(order && !Array.isArray(order)) {
      if(typeof order === 'number') {
        sOrder = order.toString()
      } else {
        sOrder = order
      }
      arrOrder = sOrder.split(',')
    }

    for(i = 0; i < arrSortBy.length; i++) {
      const orderVal = arrOrder[i] ? arrOrder[i].toString() : DEFAULT_ORDER_VAL
      arrSort.push([ arrSortBy[i].trim(), parseInt(orderVal) ])
    }

    return arrSort
  }
}
