module.exports = function (password) {
    return async function (ctx, next) {
        var pass = ( ctx.request.body  || {} ).demopass,
            wantedPage = ( ctx.request.body || {} ).wantedPage || ctx.request.url
        if ( ctx.request.url === '/DEMOBLOCKPAGE' )  {
            if (pass == password) {
                ctx.session.demo_authorized = true
                ctx.redirect(wantedPage)
            }
        }
        if (ctx.session.demo_authorized) {
            await next()
        } else {
            ctx.body = `<form action="/DEMOBLOCKPAGE" method="POST">` +
                `<input name="demopass" type="password" placeholder="Password" value=""/>` +
                `<input name="wantedPage" type="text" style="display:none;" value="${wantedPage}"/>` +
                `<button type="submit">Submit</button></form>`
        }
    }
}
