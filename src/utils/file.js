var send = require('koa-send')

module.exports = async function (ctx, path) {
    await send(ctx, path)
}
