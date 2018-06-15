var path = require('path'),
    klawSync = require('klaw-sync')

class Route {
    constructor(routeFile) {
        Object.assign(this, routeFile)
        this.handler = require(this.path).handler
        this.routeName = require(this.path).routeName
        this.extension = require(this.path).ext
        this.roles = require(this.path).roles
        if (this.extension) {
            this.route += this.extension
        }
        Object.defineProperty(this, 'permission', {
            enumerable: true,
            get: () => {
                return  {
                    route: this.route,
                    method: this.method,
                    roles: this.roles
                }
            }
        })
    }
}

function getFiles(routePath) {
    return klawSync(routePath).map(file => {
        var fileObj = path.parse(file.path)
        fileObj.path = file.path
        return fileObj
    })
}

function isRouteFile(file) {
    return file.ext === '.js' && file.name != 'allRoutes'
}

function assignMethodRoute(file) {
    var method = file.ext === '.js' ? file.name.toUpperCase() : undefined,
        parts = file.path.split(path.sep),
        routeIndex = parts.indexOf('routes'),
        routeParts = parts.filter(part => parts.indexOf(part) > routeIndex)
        .map(part => part.replace('_p_', ':'))
        .map(part => part.replace('_', '')),
        route = undefined

    //remove the file
    routeParts.pop()
    route = '/' + routeParts.join('/')
    return Object.assign(file, { method, route })
}

module.exports = class RouteManager {
    constructor(routePath) {
        this.routePath = routePath
        Object.defineProperty(this, 'routes', {
            writable: false,
            enumerable: false,
            value: getFiles(routePath)
                .filter(isRouteFile)
                .map(assignMethodRoute)
                .map(routeFile => new Route(routeFile))
        })
        Object.defineProperty(this, 'permissions', {
            enumerable: true,
            get: () => this.routes.map(route => route.permission)
        })
    }

    addRoute(router, method, routeString, asyncHandler) {
        router[method.toLowerCase()].call(router, routeString, asyncHandler)
    }

    addAll(router) {
        this.routes.forEach((route) =>{
            this.addRoute(router, route.method, route.route, route.handler)
        })
    }

    addPath(router, path) {
        var routeObj = this.pathToRoute(path),
            handler = this.handlerForPath(path)
        this.addRoute(router, routeObj.method, routeObj.route, handler)
    }
}
