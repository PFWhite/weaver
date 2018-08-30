/*
  Requires sessions

  See gatekeeper.js for more information
 */
module.exports = function (sessionLookup) {
    return async function(ctx, next) {
        var user = undefined
        if (ctx.session) {
            user = await sessionLookup(ctx.session)
            if (user) {
                ctx.state.user = user
            }
        }
        await next()
    }
}
