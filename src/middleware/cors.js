/*
  The render function on the context needs to be enhanced
*/
var castArray = require('../utils/data.js').castArray

module.exports = function (isValidOrigin) {
    if (!(typeof isValidOrigin == 'function')) {
        throw Error('Provide an is valid origin method for the cors middleware')
    }
    return async function (ctx, next) {
        if (isValidOrigin(ctx)) {
            ctx.res.setHeader('Access-Control-Allow-Origin', ctx.headers.origin)
            ctx.res.setHeader('Access-Control-Allow-Methods', 'PUT, UPDATE, POST, GET, OPTIONS, DELETE')
            ctx.res.setHeader('Access-Control-Allow-Headers', 'content-type')
            ctx.res.setHeader('Access-Control-Max-Age', 86400)
        }
        await next()
    }
}
