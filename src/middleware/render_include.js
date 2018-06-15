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
