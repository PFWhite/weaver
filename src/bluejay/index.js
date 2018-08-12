const DatabaseConnection = require('./database_connection.js'),
      SQLQueries = require('./sql_queries.js'),
      DB = require('./db.js'),
      SQLResult = require('./sql_result.js')


function makeConnection(user, host, database, password, port) {
    return new DatabaseConnection({
        user, host, database, password, port
    })
}

function makeSQLQueries(directory, sqlTemplateRoot, options) {
    return new SQLQueries(directory, sqlTemplateRoot, options)
}

function makeDB(queries, connection, resultsConstructor=SQLResult) {
    return new DB(queries, connection, {
        resultsConstructor
    })
}

module.exports = {
    makeConnection,
    makeSQLQueries,
    makeDB
}
