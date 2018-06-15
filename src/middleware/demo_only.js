module.exports = function (password) {
    return async function (ctx, next) {
        var pass = ( ctx.request.body  || {} ).demopass
        if (pass == password) {
            ctx.session.demo_authorized = true
        }
        if (ctx.session.demo_authorized) {
            await next()
        } else {
            ctx.body = '<form action="/" method="POST"><input name="demopass" type="password" placeholder="Password" value=""/><button type="submit">Submit</button></form>'
        }
    }
}
