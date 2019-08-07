const Pool = require('pg').Pool
const QueryStream = require('pg-query-stream')


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

async function stream(q) {
    const client = await this.pool.connect()
    const query = new QueryStream(q)
    const stream = client.query(query)

    stream.on('end', () => {
        query.stop()
        client.release()
    })
    return stream
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
            },
            stream: {
                value: stream.bind(this)
            },
            poolMax: {
                value: options.max || 10
            }
        })
    }

}
