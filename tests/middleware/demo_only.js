var demoOnly = require('../../src/middleware/demo_only.js'),
    tu = require('../util.js')

var formData = "<form action=\"/BLOCKPAGE\" method=\"POST\"><input name=\"demopass\" type=\"password\" placeholder=\"Password\" value=\"\"/><input name=\"wantedPage\" type=\"text\" style=\"display:none;\" value=\"/BLOCKPAGE\"/><button type=\"submit\">Submit</button></form>"
var formDataNoDemoPage = "<form action=\"/BLOCKPAGE\" method=\"POST\"><input name=\"demopass\" type=\"password\" placeholder=\"Password\" value=\"\"/><input name=\"wantedPage\" type=\"text\" style=\"display:none;\" value=\"undefined\"/><button type=\"submit\">Submit</button></form>"

describe('demo_only', () => {
    var ctx = undefined
    beforeEach(() => {
        ctx = tu.mockCtx()
    })
    it('should return a function', () => {
        expect(demoOnly()).toBeFunction()
    })
    describe('ctx.request.url === /BLOCKPAGE', () => {
        var checkPass = jest.fn(),
            getPage = jest.fn(),
            func = undefined,
            next = tu.next()

        beforeEach(() => {
            ctx.request.url = '/BLOCKPAGE'
            next.mockClear()
            getPage.mockClear()
        })
        describe('checkPass gets the ctx', () => {
            it('should be passed the ctx as the second arg', async () => {
                func = demoOnly(checkPass, getPage)
                await func(ctx, next)
                expect(checkPass).toHaveBeenCalledWith(undefined, ctx)
            })
        })

        describe('checkPass resolves', () => {
            beforeEach(() => {
                tu.resolveWith(checkPass, true)
                tu.resolveFunc(getPage, tu.ident)
                func = demoOnly(checkPass, getPage)
            })
            it('should set session.demo_authorized', () => {
                return func(ctx, next).then(data => {
                    expect(ctx.session.demo_authorized).toBeTrue()
                })
            })
            it('should call ctx.redirect', () => {
                return func(ctx, next).then(data => {
                    expect(ctx.redirect).toHaveBeenCalled()
                })
            })
            it('should not call getPage to render the form', () => {
                return func(ctx, next).then(data => {
                    expect(getPage).not.toHaveBeenCalled()
                })
            })
            it('should call next', () => {
                return func(ctx, next).then(data => {
                    expect(next).toHaveBeenCalled()
                })
            })

        })
        describe('checkPass resolves false', () => {
            beforeEach(() => {
                tu.resolveWith(checkPass, false)
                tu.resolveFunc(getPage, tu.ident)
                func = demoOnly(checkPass, getPage)
            })
            it('should not set demo_authorized', () => {
                return func(ctx, next).then(data => {
                    return expect(ctx.session.demo_authorized).toBeUndefined()
                })
            })
            it('should not call next', () => {
                return func(ctx, next).then(data => {
                    return expect(next).not.toHaveBeenCalled()
                })
            })
            it('should call getPage', () => {
                return func(ctx, next).then(data => {
                    return expect(getPage).toHaveBeenCalled()
                })
            })
            it('should pass the formData to getPage', () => {
                return func(ctx, next).then(data => {
                    return expect(getPage).toHaveBeenCalledWith(formData)
                })
            })
            it('should set ctx.body', async () => {
                await func(ctx, next)
                var test= undefined
                expect(getPage).toHaveBeenCalled()
                expect(ctx.body).toResolve()
                expect(ctx.body).toBeString()
            })
            it('should set the wantedPage correctly', async () => {
                ctx.request.body.wantedPage = 'I want this page'
                await func(ctx, next)
                expect(ctx.body).toInclude('I want this page')
            })
        })
    })
})
