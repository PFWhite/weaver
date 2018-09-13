/*
  This middleware takes an object and includes that into any subsequent render calls

  This is often used for including deployment information into the html, like the
  host of a static resource
 */
module.exports = function (options={}) {
    return async function (ctx, next) {
        var render = ctx.render
        ctx.render = function () {
            var template = arguments[0],
                context = arguments[1],
                callback = arguments[2]

            Object.assign(context, options)
            return render(template, context, callback)
        }
        await next()
    }
}
