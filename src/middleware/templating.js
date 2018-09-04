var nunjucks = require('nunjucks'),
    views = require('koa-views')

module.exports = function (templateDir, globals={}) {
    // need to make a loader for extends
    // https://github.com/queckezz/koa-views/issues/104
    var nunjucksEnv = new nunjucks.Environment(
        new nunjucks.FileSystemLoader(templateDir)
    )
    Object.keys(globals).forEach(key => {
        nunjucksEnv.addGlobal(key, globals[key])
    })
    return views(templateDir, {
        options: {
            nunjucksEnv
        },
        map: {
            html: 'nunjucks'
        }
    })
}
