var useragent = require('useragent')
function addNoCache(ctx) {
    ctx.set('Cache-Control', 'no-store, no-cache, must-revalidate')
    ctx.set('Pragma', 'no-cache')
    ctx.set('Expires', 0)
}

module.exports = function (options={}) {
    /*
      Takes an options object

      checker <= async function that returns boolean to add no cache directives
      IE <= boolean that indicates to add the no cache directive for all microsoft browsers
     */
    return async function (ctx, next) {
        var noCache = false


        if (options.checker && typeof options.checker === 'function') {
            noCache = await options.checker(ctx)
        }


        if (options.IE) {
            if (useragent.is(ctx.request.headers['user-agent']).ie) {
                noCache = true
            }
        }


        if (noCache) {
            addNoCache(ctx)
        }

        await next()
    }
}
