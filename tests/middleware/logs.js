var logs = require('../../src/middleware/logs.js'),
    tu = require('../util.js')

describe('logs.js', () => {
    it('should return a middleware function', () => {
        expect(logs()).toBeFunction()
    })
    describe('middleware', () => {
        var logFuncs = [jest.fn(), jest.fn()],
            makeLogObj = jest.fn(),
            afterNext = jest.fn(),
            ctx = undefined,
            func = undefined,
            logObj = {},
            next = tu.next()
        beforeEach(() => {
            ctx = tu.mockCtx()
            logFuncs.forEach(fn => {
                tu.resolveFunc(fn, tu.noop)
                fn.mockClear()
            })
            tu.resolveWith(makeLogObj, logObj)
            makeLogObj.mockClear()
            tu.resolveFunc(afterNext, (ctx, obj) => {
                obj.test = 'test'
            })
            afterNext.mockClear()
            next.mockClear()
            func = logs(makeLogObj, afterNext, logFuncs)
        })
        it('should call next and each logfunc with a log object from afterNext', async () => {
            await func(ctx, next)
            expect(makeLogObj).toHaveBeenCalledWith(ctx)
            expect(next).toHaveBeenCalled()
            expect(afterNext).toHaveBeenCalledWith(ctx, logObj)
            logFuncs.forEach(f => {
                expect(f).toHaveBeenCalled()
                expect(f).toHaveBeenCalledWith(Object.assign(logObj, {test:'test'}))
            })
        })
        it('should not call afterNext or any of the log functions if next errors', async () => {
            tu.rejectWith(next, 'blargh', {})
            try {
                await func(ctx, next)
            } catch (err) {
                expect(makeLogObj).toHaveBeenCalledWith(ctx)
                expect(next).toHaveBeenCalled()
                expect(afterNext).not.toHaveBeenCalled()
                expect(err).toEqual('blargh')
                logFuncs.forEach(f => {
                    expect(f).not.toHaveBeenCalled()
                })
            }
        })

    })
})
