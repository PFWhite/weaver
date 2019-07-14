var demoOnly = require('../../src/middleware/demo_only.js'),
    tu = require('../util.js')

var formData = "<form action=\"/DEMOBLOCKPAGE\" method=\"POST\"><input name=\"demopass\" type=\"password\" placeholder=\"Password\" value=\"\"/><input name=\"wantedPage\" type=\"text\" style=\"display:none;\" value=\"/DEMOBLOCKPAGE\"/><button type=\"submit\">Submit</button></form>"
var formDataNoDemoPage = "<form action=\"/DEMOBLOCKPAGE\" method=\"POST\"><input name=\"demopass\" type=\"password\" placeholder=\"Password\" value=\"\"/><input name=\"wantedPage\" type=\"text\" style=\"display:none;\" value=\"undefined\"/><button type=\"submit\">Submit</button></form>"

describe('demo_only', () => {
    var ctx = undefined
    beforeEach(() => {
        ctx = tu.mockCtx()
    })
    it('should return a function', () => {
        expect(demoOnly()).toBeFunction()
    })
    describe('ctx.request.url === /DEMOBLOCKPAGE', () => {
        var checkPass = undefined,
            getPage = tu.resolveFunc(jest.fn(), tu.ident),
            func = undefined,
            next = tu.next()

        beforeEach(() => {
            ctx.request.url = '/DEMOBLOCKPAGE'
            next.mockClear()
        })
        describe('checkPass resolves', () => {
            beforeEach(() => {
                checkPass = tu.resolveWith(jest.fn(), true)
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
                checkPass = tu.resolveWith(jest.fn(), false)
                func = demoOnly(checkPass, getPage)
            })
            it('should not set demo_authorized', () => {
                return func(ctx, next).then(data => {
                    expect(ctx.session.demo_authorized).toBeUndefined()
                })
            })
            it('should not call next', () => {
                return func(ctx, next).then(data => {
                    expect(next).not.toHaveBeenCalled()
                })
            })
            it('should call getPage', () => {
                return func(ctx, next).then(data => {
                    expect(getPage).toHaveBeenCalled()
                })
            })
            it('should pass the formData to getPage', () => {
                return func(ctx, next).then(data => {
                    expect(getPage).toHaveBeenCalledWith(formData)
                })
            })
            it('should set ctx.body', () => {
                return func(ctx, next).then(data => {
                    expect(getPage.mock.results[0].value).resolves.toEqual(formData)
                })
            })
            it('should set the wantedPage correctly', () => {
                ctx.request.body.wantedPage = 'I want this page'
                return func(ctx, next).then(async data => {
                    expect(getPage.mock.results[0].value).resolves.toInclude('I want this page')
                })
            })
        })
    })
    describe('ctx.request.url != /DEMOBLOCKPAGE', () => {

        var checkPass = undefined,
            getPage = tu.resolveFunc(jest.fn(), tu.ident),
            func = undefined,
            next = tu.next()
        beforeEach(() => {
            checkPass = tu.resolveWith(jest.fn(), false)
            func = demoOnly(checkPass, getPage)
        })
        it('should not set demo_authorized', () => {
            return func(ctx, next).then(data => {
                expect(ctx.session.demo_authorized).toBeUndefined()
            })
        })
        it('should not call next', () => {
            return func(ctx, next).then(data => {
                expect(next).not.toHaveBeenCalled()
            })
        })
        it('should call getPage', () => {
            return func(ctx, next).then(data => {
                expect(getPage).toHaveBeenCalled()
            })
        })
        it('should pass the formData to getPage', () => {
            return func(ctx, next).then(data => {
                expect(getPage).toHaveBeenCalledWith(formDataNoDemoPage)
            })
        })
        it('should set ctx.body', () => {
            return func(ctx, next).then(data => {
                expect(getPage.mock.results[0].value).resolves.toEqual(formDataNoDemoPage)
            })
        })
        it('should set the wantedPage correctly', () => {
            ctx.request.body.wantedPage = 'I want this page'
            return func(ctx, next).then(async data => {
                expect(getPage.mock.results[0].value).resolves.toInclude('I want this page')
            })
        })
    })
})
