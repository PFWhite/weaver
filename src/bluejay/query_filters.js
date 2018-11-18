var isUndef = require('./utils.js').isUndef

function esc(value) {
    /*
      Escapes values that are entered
    */
    if (typeof value == 'string' && value !== 'NULL') {
        return `'${value.replace(/'/g, "''")}'`
    } else if (typeof value == 'number') {
        return value
    } else if (Array.isArray(value)) {
        return wrap(value.map(esc))
    } else if (isUndef(value)) {
        return 'DEFAULT'
    } else if (typeof value == 'function') {
        return value()
    } else if (value === 'NULL') {
        return 'NULL'
    } else {
        throw Error(`esc filter passed ${value} a ${typeof value}. Please pass a string number array or function`)
    }
}

function dq(value) {
    // Double quote, handles array valued things
    if (Array.isArray(value)) {
        return value.map(dq)
    } else {
        return `"${value}"`
    }
}

function json(value) {
    return JSON.stringify(value)
}

function access(items, key) {
    return items.map(item => item[key])
}

function orderedVals (value, keys) {
    return keys.map(key => value[key])
}

function wrap(value, left='(', right=')') {
    return `${left}${value}${right}`
}

function values(value, cols) {
    return wrap(esc(orderedVals(value, cols)).join(','))
}

function columns(value) {
    return dq(value).join(', ')
}

module.exports = {
    esc,
    dq,
    json,
    orderedVals,
    columns,
    values,
    access,
    wrap
}
