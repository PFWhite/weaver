var noCache = require('../../src/middleware/no_cache.js'),
    tu = require('../util.js'),
    ctx, func, checker, next

var ie11agent = 'Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; rv:11.0) like Gecko'
var chrome = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.77 Safari/537.36'
var noAgent = 'this is not a real agent string'

describe('no_cache.js', () => {
    it('should return a middleware function', () => {
        expect(noCache()).toBeFunction()
    })
    beforeEach(() => {
        ctx = tu.mockCtx()
        func = undefined
        checker = jest.fn()
        next = tu.next()
        next.mockClear()
        checker.mockClear()
    })
    describe('middleware', () => {
        describe('options.checker', () => {
            it('should call the checker', async () => {
                tu.resolveWith(checker, true)
                func = noCache({checker})
                await func(ctx, next)
                expect(checker).toHaveBeenCalled()
                expect(next).toHaveBeenCalled()
            })
            it('should set the cache headers', async () => {
                tu.resolveWith(checker, true)
                func = noCache({checker})
                await func(ctx, next)
                expect(ctx.set).toHaveBeenCalled()
                expect(ctx.set).toHaveBeenCalledTimes(3)
            })
            it('should not set the headers if not checker', async () => {
                tu.resolveWith(checker, false)
                func = noCache({checker})
                await func(ctx, next)
                expect(ctx.set).not.toHaveBeenCalled()
            })

        })
        describe('options.IE', () => {
            beforeEach(() => {
                func = noCache({IE: true})
            })
            it('should only add the no cache if IE useragent', async () => {
                ctx.request.headers['user-agent'] = ie11agent
                await func(ctx, next)
                expect(ctx.set).toHaveBeenCalled()
                expect(ctx.set).toHaveBeenCalledTimes(3)
            })
            it('should not noCache if not ie => chrome instead', async () => {
                ctx.request.headers['user-agent'] = chrome
                await func(ctx, next)
                expect(ctx.set).not.toHaveBeenCalled()
            })
            it('should not noCache if not ie => garbage instead', async () => {
                ctx.request.headers['user-agent'] = noAgent
                await func(ctx, next)
                expect(ctx.set).not.toHaveBeenCalled()
            })
        })
        it('should call next', async () => {
            func = noCache({})
            await func(ctx, next)
            expect(next).toHaveBeenCalled()
        })
        describe('noop', () => {
            it('should not call ctx.set when otherwise', async () => {
                func = noCache()
                await func(ctx, next)
                expect(ctx.set).not.toHaveBeenCalled()
                expect(next).toHaveBeenCalled()
            })
        })


    })
})
