module.exports = function (middlewareName, middleware) {
    async function task() {
        this.app.use(middleware)
    }
    task.taskName = `Attaching middleware ${middlewareName}`
    return task
}
