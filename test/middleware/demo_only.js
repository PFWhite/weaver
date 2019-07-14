var demoOnly = require('../../src/middleware/demo_only.js')
    tutils = require('../utils.js')
describe('demo only', () => {
    var ctx = undefined
    beforeEach(() => {
        ctx = tutils.mockCtx()
    })
    it('should return a function', () => {
        chai.expect(demoOnly()).to.be.a('function')
    })
    describe('ctx.request.url === /DEMOBLOCKPAGE', () => {

    })
})
