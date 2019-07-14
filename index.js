const path = require('path')
global.base_dir = __dirname
global.server_path = function (filepath) {
    return [base_dir, filepath].join(path.sep)
}
global.absrequire = function (file) {
    // lets you require modules as relative paths from app/server
    return require(server_path(file))
}
module.exports = {
    bluejay: require('./src/bluejay'),
    coordinator: require('./src/setup/coordinator.js'),
    middleware: require('./src/middleware'),
    setupTasks: require('./src/setup/tasks'),
    utils: require('./src/utils')
}
