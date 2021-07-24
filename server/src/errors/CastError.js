import DatabaseError from "./DatabaseError.js";

export default class CastError extends DatabaseError {
  constructor(message, options={}) {
    super(message, options)
  }
}