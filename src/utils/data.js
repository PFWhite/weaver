function castArray(arg) {
    return Array.isArray(arg) ? arg : [arg]
}

function isUndef(arg) {
    return typeof arg == 'undefined'
}

function isDef(arg) {
    return typeof data != 'undefined'
}

function defineSubnamespace(obj, prop, value={}) {
    /*
      Used by setupNamespaces to set the obj[prop]
     */
    Object.defineProperty(obj, prop, {
        value,
        enumerable: true,
        writable: false
    })
}

function setupNamespaces(obj, namespaces) {
    /*
      Defines objects on the way down.
      obj = {
        namespaces[0]: {
            namespaces[1]: {}
        }
      }
      Like that
     */
    namespaces.reduce((current, subdir) => {
        if (isUndef(current[subdir])) {
            defineSubnamespace(current, subdir)
        }
        return current[subdir]
    }, obj)
}

function flatmap(arr, lambda) {
    return [].concat(...arr.map(lambda))
}


module.exports = {
    castArray,
    isUndef,
    isDef,
    flatmap,
    defineSubnamespace,
    setupNamespaces
}
