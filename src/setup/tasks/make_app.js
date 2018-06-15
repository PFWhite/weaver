const koa = require('koa')

module.exports = function (subdomainOffset) {
    async function task() {
        var app = new koa()
        app.subdomainOffset = subdomainOffset
        this.app = app
    }
    task.taskName = `Making app with subdomainOffset=${subdomainOffset}`
    return task
}
