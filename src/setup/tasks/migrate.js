function upgrade(target) {
    async function task() {
        var DB = this.DB
        DB.upgrade[target]()
        await DB.result()
    }
    task.taskName = `Upgrading to ${target}`
    task.retryPolicy = 'continue'
    task.maxAttempts = 3
    return task
}

function downgrade(target) {
    async function task() {
        var DB = this.DB
        DB.downgrade[target]()
        await DB.result()
    }
    task.taskName = `Downgrading from ${target}`
    task.retryPolicy = 'continue'
    task.maxAttempts = 3
    return task
}

module.exports = {
    upgrade, downgrade
}
