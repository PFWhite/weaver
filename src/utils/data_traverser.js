/*
  This class is used when you just want to recursivly look inside an object.

  Does it contain child arrays? Then we want to have a function that gets passed
  the array, and then will be called with each of the array's items.

  Does it contain child objects? Then we want to have a function that gets passed
  the object and then gets passed the values of each of the keys

  If you want to save any state as you go through the object, your function you
  pass into the constructor needs to modify the 'this.data' property
  which can be proxied to another object by passing an accumulator in
 */
class Traverser{
    constructor(func, obj, accumulator) {
        this.func = func.bind(this)
        this.obj = obj
        this.data = accumulator || {}
    }

    go() {
        this.iter(this.obj)
        return this.data
    }

    iter(item) {
        var type = Array.isArray(item) ? 'array' : typeof item
        switch (type) {
            case 'object':
                this.objIter(item)
                break
            case 'array':
                this.arrayIter(item)
                break
            default:
                this.stringOrNum(item)
        }
    }

    objIter(item) {
        Object.entries(item).map((kv) => kv[1]).forEach((obj) => {
            this.func(obj)
            this.iter(obj)
        })
    }

    arrayIter(item) {
        item.forEach((obj) => {
            this.func(obj)
            this.iter(obj)
        })
    }

    stringOrNum(item) {
        this.func(item)
    }

}

function getTraverser(func, obj, acc) {
    return new Traverser(func, obj, acc)
}

module.exports = {
    Traverser,
    getTraverser
}
