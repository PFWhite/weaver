var nunjucks = require('nunjucks'),
    views = require('koa-views')

module.exports = function (templateDir) {
    // need to make a loader for extends
    // https://github.com/queckezz/koa-views/issues/104
    var nunjucksEnv = new nunjucks.Environment(
        new nunjucks.FileSystemLoader(templateDir)
    )
    return views(templateDir, {
        options: {
            nunjucksEnv
        },
        map: {
            html: 'nunjucks'
        }
    })
}
