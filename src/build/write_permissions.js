var allRoutes = absrequire('routes/allRoutes.js'),
    path = require('path'),
    fs = require('fs-extra')

async function writePermissions() {
    // This has the ability to restart the server in testing mode
    var permissionEnumPath = '/home/miranda/app/server/constants/allPermissions.json'
    var permissionsData = allRoutes.permissions.map(item => {
        return {
            subdomain: item.subdomain,
            route: item.route,
            method: item.method,
            roles: item.roles
        }
    })

    var permissions = absrequire('constants/allPermissions.json'),
        newperms = JSON.stringify(permissionsData, null, 2),
        oldperms = JSON.stringify(permissions, null, 2)

    if (newperms != oldperms) {
        if (this.verbose) console.log('Found new routes, regenerating allPermissions.json');
        fs.writeFileSync(permissionEnumPath, newperms)
    }
    return this
}
writePermissions.taskName = `maybe updating permissionsEnum.json`

module.exports = writePermissions
