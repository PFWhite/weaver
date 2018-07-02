/*
  This middleware takes an object and includes that into any subsequent render calls

  This is often used for including deployment information into the html, like the
  host of a static resource
 */
module.exports = function (options={}) {
    return async function (ctx, next) {
        var render = ctx.render
        ctx.render = function (template, context={}) {
            Object.assign(context, options)
            return render(template, context)
        }
        await next()
    }
}
