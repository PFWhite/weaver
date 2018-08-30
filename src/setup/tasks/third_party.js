const helmet = require('koa-helmet'),
      responseTime = require('koa-response-time'),
      session = require('koa-session'),
      crypto = require('crypto')

module.exports = function(options={}) {
    async function task() {
        this.app.use(responseTime())
        this.app.use(helmet())

        var numMinutes = options.numMinutes || 20,
            seconds = 1000,
            minutes = 60 * seconds

        const sessionConfig = {
            key: ( options.cookieName || 'app-sess' ),
            maxAge: numMinutes * minutes,
            overwrite: true,
            signed: true,
            httpOnly: true,
            // this allows the cookie to propagate through subdomains
            domain: options.domain,
            rolling: true
        }
        this.app.keys = [ Buffer.from(options.sessionKey || 'this is a secret string') ]
        this.app.use(session(sessionConfig, this.app))
    }
    task.taskName = 'Attach responsetime, helmet, session'
    return task
}
