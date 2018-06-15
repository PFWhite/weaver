var RouteManager = require('../../routing/allRoutes.js'),
    Router = require('koa-router')

module.exports = function addRoutes(routePath) {
    var rm = new RouteManager(routePath),
        router = new Router()

    async function task() {
        rm.addAll(router)
        this.app.use(router.routes())
    }
    task.taskName = `Attaching routes at ${routePath}`
    return task
}
