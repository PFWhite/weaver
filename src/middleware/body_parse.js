/*
  We need to parse files and other things from request body's
*/
var castArray = require('../utils/data.js').castArray

var http = require('http'),
    path = require('path'),
    os = require('os'),
    fs = require('fs')

var Busboy = require('busboy'),
    busboyContentTypes = [
        'multipart/form-data',
        'application/x-www-form-urlencoded'
    ]

function busboyCanParse(request) {
    return request.method == 'POST' &&
        busboyContentTypes.indexOf(request.headers['content-type']) > -1
}

function isJsonBody(request) {
    return request.headers['content-type'] === 'application/json'
}

module.exports = function (uploadDir, fileName) {
    if (typeof uploadDir != 'function') {
        uploadDir = () => {
            return 'tmp'
        }
    }
    if (typeof fileName != 'function') {
        fileName = (name) => Date.now() + '_' + name
    }

    return async function (ctx, next) {

        return new Promise((resolve, reject) => {
            if (busboyCanParse(ctx.request)) {
                var busboy = new Busboy({ headers: ctx.request.headers })
                ctx.request.body = {}

                busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
                    var files = ctx.request.files = ctx.request.files || {},
                        savePath = path.join(uploadDir(fieldname), fileName(path.basename(filename)))

                    console.log(savePath);
                    if (!files[fieldname]) {
                        var fileStream = fs.createWriteStream(savePath)
                        files[fieldname] = {
                            fieldname,
                            file,
                            name: filename,
                            encoding,
                            fileType: mimetype,
                            path: savePath,
                            size: 0
                        }

                        file.on('data', function(data) {
                            files[fieldname].size += data.length
                            fileStream.write(data)
                        })

                        file.on('end', function() {
                            console.log(`Finished file: ${savePath}, size: ${files[fieldname].size}`)
                            fileStream.end()
                        })
                    } else {
                        file.on('data', function(data) {
                            console.log('data');
                        })
                        file.on('end', function() {
                            console.error(`field: ${fieldname} submitted second file ${filename}`)
                        })
                    }

                })

                busboy.on('field', function(fieldname, val, fieldnameTruncated, valTruncated) {
                    ctx.request.body[fieldname] = val
                })
                busboy.on('finish', async function() {
                    resolve(next())
                })
                ctx.req.pipe(busboy)
            } else if (isJsonBody(ctx.request)) {
                ctx.request.body = {}
                var jsonData = []

                ctx.req.on('data', (chunk) => {
                    jsonData.push(chunk)
                })
                ctx.req.on('end', () => {
                    jsonData = Buffer.concat(jsonData).toString()
                    ctx.request.body = JSON.parse(jsonData)
                    resolve(next())
                })
                ctx.req.on('error', (err) => {
                    reject(err)
                })
            } else {
                resolve(next())
            }
        })
    }
}
