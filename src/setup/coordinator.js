/*
  The coordinator class handles a simple thing,

  Try to do a sequence of tasks, if you error at any point,
  for any reason, try again a little later.

  The class instance also serves as the 'this' context for
  every async function that runs. This allows separate setup
  tasks to share state
 */

function handleError(err, taskIndex) {
    var currentTask = this.tasks[taskIndex]
    if ( currentTask.errorhandler ) {
        currentTask.errorHandler.call(this, err)
    } else {
        this.errorHandler.call(this, err, currentTask.taskName)
    }
}

function onTaskFail(currentIndex) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            this.retryDelay = (this.retryDelay + 5000) * 2
            resolve(this.setup(currentIndex))
        }, this.retryDelay)
    })
}

module.exports = class Coordinator {

    constructor(options={}) {
        this.addOptionProperties(options)
        this.addRetryDelay(options.retryDelay)
    }

    addOptionProperties(options) {
        var self = this
        options.tasks = options.tasks || []
        Object.entries(options).forEach((kv) => {
            var key = kv[0],
                val = kv[1]
            if (key !== 'tasks') {
                self[key] = val
            } else {
                self.tasks = val.map(self.addTask.bind(self))
            }
        })
    }

    addRetryDelay(retryDelay) {
        this.retryDelay = retryDelay || 0
    }

    addTask(task) {
        if (this.verbose) console.log(`Adding ${task.taskName} to coordinator`);
        var boundTask = task.bind(this)
        boundTask.taskName = task.taskName || this.tasks.length
        boundTask.errorHandler = task.errorHandler
        boundTask.maxAttempts = task.maxAttempts
        boundTask.retryPolicy = task.retryPolicy
        this.tasks.push(boundTask)
        return this
    }

    errorHandler(err, taskName) {
        console.error(`There was an error setting up ${taskName}`)
        console.error(err)
    }

    async setup(index=0) {
        try {
            if (this.tasks[index].maxAttempts && this.tasks[index].attempts >= this.tasks[index].maxAttempts) {
                if (this.verbose) console.log(`Max attempts hit for ${this.tasks[index].taskName}, policy ${this.tasks[index].retryPolicy}`);
                switch (this.tasks[index].retryPolicy) {
                case 'continue':
                    break;
                default:
                    process.exit(this.tasks[index].errorCode || 99)
                }
            } else {
                if (this.verbose) console.log(`Running task ${this.tasks[index].taskName}`);
                this.tasks[index].attempts = typeof this.tasks[index].attempts == 'number' ? this.tasks[index].attempts + 1 : 1
                var currentReturn = await this.tasks[index]()
            }
            return index < this.tasks.length -1 ? await this.setup(++index) : currentReturn
        } catch (err) {
            handleError.call(this, err, index)
            await onTaskFail.call(this, index)
        }
    }
}
