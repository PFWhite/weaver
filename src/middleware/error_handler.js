module.exports = function () {
    return async function (ctx, next) {
        try {
            await next()
        } catch (err) {
            console.error(err);
            ctx.body = err
        }
    }
}
