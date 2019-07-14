module.exports = function (makeLogObj, afterNext, logAsyncFunctions=[]) {
    /*
      Takes three functions.

      The first function is passed ctx and returns a logging Object
      The second is called afternext and is passed the ctx and the logging object
      it should mutate the logging object and can return a promise
      finally we want an array of logging functions that will take the logging object
      and log it however
     */
    return async function (ctx, next) {
        var logObj = await makeLogObj(ctx)
        await next()
        await afterNext(ctx, logObj)
        await Promise.all(logAsyncFunctions.map(f => f(logObj)))
    }
}
