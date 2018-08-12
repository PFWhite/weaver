var isUndef = require('./utils.js').isUndef,
    flatmap = require('./utils.js').flatmap,
    defineSubnamespace = require('./utils.js').defineSubnamespace

var state = {
    new: 0,
    pending: 1,
    results: 2,
    another: 3,
}

function wrapQueries(instance, queries, instanceNamespace) {
    Object.entries(queries).forEach(kv => {
        var key = kv[0],
            val = kv[1]
        if (key === 'directory' || key === 'sqlTemplateRoot') {
            // do nothing
        } else if (typeof val === 'function') {
            Object.defineProperty(instanceNamespace, key, {
                enumerable: true,
                writable: false,
                value: function () {
                    var query = val.apply(this, arguments)
                    instance.addQuery(query)
                    return query
                }
            })
        } else {
            defineSubnamespace(instanceNamespace, key)
            wrapQueries(instance, queries[key], instanceNamespace[key])
        }
    })
}

module.exports = class DB {
    constructor(queries, connection, options={}) {
        /*
          queries is an instance of the SQLQueries object
          connection is an instance of the DatabaseConnection object
         */
        this.options = options
        this.noTransact = options.noTransact
        this.verbose = options.verbose || true
        this.resultsConstructor = options.resultsConstructor

        this.pending = []
        this.ranQueries = []
        Object.defineProperty(this, 'conn', {
            value: connection
        })
        wrapQueries(this, queries, this)

    }

    clear() {
        this.pending = []
    }

    getState() {
        if (!this.pending.length && !this.ranQueries.length) {
            return state.new
        } else if (this.pending.length && !this.ranQueries.length) {
            return state.pending
        } else if (!this.pending.length && this.ranQueries.length) {
            return state.results
        } else {
            return state.another
        }
    }

    addQuery(query) {
        this.pending.push(query)
    }

    async execute() {
        return await this.results()
    }

    async result() {
        var results = await this.results()
        return results[0]
    }

    async results() {
        var results = undefined,
            current = this.getState()
        if (current == state.pending || current == state.another) {
            this.ranQueries = this.pending.slice()
            this.pending = []
            results = await this.conn.transact(...this.ranQueries)
        } else {
            throw Error('There are no pending queries')
        }
        if (this.resultsConstructor) {
            results = results.map(res => new this.resultsConstructor(res))
        }
        results.flatmap = flatmap.bind(undefined, results)
        return results
    }
}
