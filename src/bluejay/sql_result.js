/*
  This is the class that codifies the way we interact with what we get
  back from the pgpool.

  There should probably be more functions in here for things like:
  what table did this come from?
  what columns do we have?
  what query did this come from?
  whats the namespace of the query?

  The return object is complicated and I should probably be able to
  know a little more about it than I do from this class
 */
module.exports = class SQLResult {
    constructor(result) {
        Object.assign(this, result)

        Object.defineProperty(this, 'length', {
            enumerable: true,
            get: () => this.rowCount
        })
    }

    hasData() {
        return !!this.rowCount
    }

    isEmpty() {
        return !this.hasData()
    }

    asModel(modelConstructor) {
        this.rows = this.rows.map(row => new modelConstructor(row))
        return this.rows
    }
}
