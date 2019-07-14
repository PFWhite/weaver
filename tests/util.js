function mockCtx() {
    return {
        render: jest.fn(),
        redirect: jest.fn(),
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

async function noop() {
    return
}

function ident(item) {
    return item
}

function arrIdent() {
    return [...arguments]
}

function resolveWith(mock, value) {
    mock.mockImplementation(async () => value)
}

function resolveFunc(mock, func) {
    var fn = async function() {
        return func.call(this, ...arguments)
    }
    mock.mockImplementation(fn)
}

function rejectWith(mock, err, value) {
    mock.mockImplementation(() => Promise.reject(err, value))
}

function next() {
    var mock = jest.fn()
    resolveFunc(mock, noop)
    return mock
}

module.exports = {
    mockCtx,
    noop,
    ident,
    arrIdent,
    resolveWith,
    resolveFunc,
    rejectWith,
    next
}
