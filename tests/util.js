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
    return mock
}

function resolveFunc(mock, func) {
    mock.mockImplementation(async () => func(...arguments))
    return mock
}

function rejectWith(mock, err, value) {
    mock.mockImplementation(() => Promise.reject(err, value))
    return mock
}

function next() {
    return resolveFunc(jest.fn(), noop)
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
