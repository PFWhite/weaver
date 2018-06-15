module.exports = function (getDB) {
    async function task() {
        var DB = await getDB.call(this)
        this.DB = DB
        this.app.use(async function (ctx, next) {
            ctx.DB = DB
            await next()
        })
    }
    task.taskName = 'setupDB'
    return task
}
