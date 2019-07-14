function addStub(key, stub) {
    if (!this.stubs) {
        this.stubs = {}
    } else {
        if (this.stubs[key]) {
            this.stubs[key].restore()
        }
    }
    this.stubs[key] = stub
}

function addError() {
    if (module.exports.error.restore) {
        module.exports.error.restore()
    }
    this.addStub('error', this.stub(module.exports, 'error').callThrough())
}

function cleanSandbox(sandbox) {
    sandbox.restore()
    var fresh = module.exports.sandbox()
    fresh.addError()
    return fresh
}

function sandbox() {
    var fresh = sinon.sandbox.create(),
        stubs = {}
    fresh.addStub = addStub.bind(fresh)
    if (module.exports.error.restore) {
        module.exports.error.restore()
    }
    fresh.addError = addError.bind(fresh)
    return fresh
}

function applyOnValues(obj, method, self, args) {
    Object.values(obj).forEach(val => {
        val[method].apply(self, args)
    })
}

function mockCtx() {
    return {
        render: () => undefined,
        redirect: () => undefined,
        DB: {},
        session: {},
        params: {},
        state: {
            user: {},
        },
        request: {
            body: {
                fields: {},
                files: {}
            },
            route: '',
            method: ''
        }
    }
}


function error(error) {
    console.log(error)
    return error
}

function setup(args) {
    var isAsync = !!args.async,
        runBeforeOnce = !!args.once,
        beforeSetup = args.beforeSetup || (item => item),
        afterSetup = args.afterSetup || (item => item),
        setupFunc = args.setup,
        retval = undefined,
        errHandler = args.errHandler || module.exports.error

    if ( isAsync ) {
        return asyncSetup(runBeforeOnce ? 'once' : 'each',
                          beforeSetup,
                          setupFunc,
                          afterSetup,
                          errHandler)
    } else {
        if (runBeforeOnce) {
            before((done) => {
                try {
                    beforeSetup()
                    retval = setupFunc()
                    afterSetup()
                    done()
                } catch (err) {
                    done(errHandler(err))
                }
            })
        } else {
            beforeEach((done) => {
                try {
                    beforeSetup()
                    retval = setupFunc()
                    afterSetup()
                    done()
                } catch (err) {
                    done(errHandler(err))
                }
            })
        }
    }
    return retval
}

function wrap(func) {
    return (something) => {
        func()
        return something
    }
}

function asyncSetup(type, beforeAsync, asyncFunc, afterAsync, errHandler) {
    if ( !errHandler ) {
        errHandler = module.exports.error
    }

    var self = this,
        beforeBody = function (done) {
            beforeAsync()
            return asyncFunc()
                .then(wrap(afterAsync))
                .catch(errHandler)
                .then(wrap(done))
        }

    if ( type == 'each' ) {
        beforeEach((done) => {
            beforeBody(done)
        })
    } else if (type == 'once'){
        before((done) => {
            beforeBody(done)
        })
    }
}

function cleanupOnce(cleanup) {
    return clean.bind(this, 'once')(cleanup)
}

function cleanupEach(cleanup) {
    return clean.bind(this, 'each')(cleanup)
}

function clean(type, cleanup) {
    if ( type == 'each' ) {
        afterEach((done) => {
            cleanup()
            done()
        })
    } else if ( type == 'once') {
        after((done) => {
            cleanup()
            done()
        })
    }
}

module.exports = {
    error,
    setup,
    cleanupOnce,
    cleanupEach,
    mockCtx,
    sandbox,
    cleanSandbox
}
