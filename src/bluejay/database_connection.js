const Pool = require('pg').Pool


async function single() {
    try {
        return await this.pool.query(...arguments)
    } catch (err) {
        console.error('There was a problem with a query')
        console.error(err)
    }
}

async function many() {
    const client = await this.pool.connect()
    var results = []

    try {
        results = await [].reduce.call(arguments, async (prom, query) => {
            return prom.then( async (results) => {
                var result = await client.query(query)
                results.push(result)
                return results
            })
        }, Promise.resolve([]))
    } catch (err) {
        client.release()
        throw err
    }
    client.release()
    return results
}


module.exports = class DatabaseConnection {
    constructor(options) {
        /*
          options = {user, host, database, password, port}
         */
        Object.defineProperty(this, 'pool', {
            writable: false,
            enumerable: false,
            value: new Pool(options)
        })
        Object.defineProperties(this, {
            single: {
                value: single.bind(this)
            },
            many: {
                value: many.bind(this)
            }
        })
    }

    async transact() {
        var args = [].slice.call(arguments)
        args = args.map((query) => {
            return `BEGIN \n ${ query } \n EXCEPTION \n COMMIT \n`
        })
        return await this.many(...arguments)
    }

}
