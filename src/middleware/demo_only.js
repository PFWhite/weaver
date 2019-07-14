module.exports = function (checkPass, getPage) {
    /*
      Takes a checkPass and getPage function
      checkPass make sure that the demo is valid and the getPage
      takes a string and returns the html page
     */
    return async function (ctx, next) {
        var pass = ( ctx.request.body  || {} ).demopass,
            wantedPage = ( ctx.request.body || {} ).wantedPage || ctx.request.url

        if ( ctx.request.url === '/DEMOBLOCKPAGE' )  {
            var isAuthorized = false
            isAuthorized = await checkPass(pass)
            if (isAuthorized) {
                ctx.session.demo_authorized = true
                ctx.redirect(wantedPage)
            }
        }

        if (ctx.session.demo_authorized) {
            await next()
        } else {
            var form = `<form action="/DEMOBLOCKPAGE" method="POST">` +
                `<input name="demopass" type="password" placeholder="Password" value=""/>` +
                `<input name="wantedPage" type="text" style="display:none;" value="${wantedPage}"/>` +
                `<button type="submit">Submit</button></form>`
            ctx.body = await getPage(form)
        }
    }
}
