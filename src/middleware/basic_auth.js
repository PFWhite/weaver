var auth = require('basic-auth')

module.exports = function (basicAuthLookup) {
    return async function(ctx, next) {
        var credentials = {},
            headerContent = ctx.request.get('Authorization'),
            user = undefined

        if (headerContent) {
            credentials = auth.parse(headerContent)
        }
        user = await basicAuthLookup(credentials.name, credentials.pass)
        if (user) {
            ctx.state.user = user
        }
        await next()
    }
}
