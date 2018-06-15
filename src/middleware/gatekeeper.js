/*
  Used to determine if a particular user can use access a the
  requested route. Meant to be added after basic_auth and
  session_auth

  Takes a validate and onNotValid async functions
 */
module.exports = function (validate, onNotValid) {
    return async function (ctx, next) {
        var user = (ctx.state || {}).user,
            validated = undefined

        validated = await validate(user, ctx, next)
        if (validated) {
            await next()
        } else {
            await onNotValid(ctx, next)
        }
    }
}
