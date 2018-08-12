var nunjucks = require('nunjucks'),
    klawSync = require('klaw-sync'),
    path = require('path'),
    setupNamespaces = require('./utils.js').setupNamespaces,
    filters = require('./query_filters.js')

module.exports = class SQLQueries {
    constructor(directory, sqlTemplateRoot, options={}) {
        const sqlFilePath = [directory, sqlTemplateRoot].join(path.sep),
              sqlTemplateFiles = klawSync(sqlFilePath),
              templateLoader = new nunjucks.FileSystemLoader(sqlFilePath),
              envOpts =  options.environment || {
                  autoescape: false,
                  throwOnUndefined: true,
                  watch: true,
                  tags: {
                      commentStart: '/*',
                      commentEnd: '*/'
                  }
              }
        this.directory = directory
        this.sqlTemplateRoot = sqlTemplateRoot

        Object.defineProperty(this, 'env', {
            writable: false,
            enumerable: false,
            value: new nunjucks.Environment(templateLoader, envOpts)
        })

        Object.entries(filters).forEach(kv => {
            this.env.addFilter(kv[0], kv[1])
        })
        this.env.addFilter()

        var templates = sqlTemplateFiles.map(this.setupTemplateObject.bind(this))
            .filter(template => !!template.ext)

        templates.forEach(template => this.setupTemplateNamespaces(template))
    }

    setupTemplateObject(filePath) {
        var file = path.parse(filePath.path)
        file.parents = file.dir.split(path.sep)
        file.leading = file.parents.filter((dir) => {
            return file.parents.indexOf(dir) > file.parents.indexOf(this.sqlTemplateRoot)
        })
        return file
    }

    getQueryFunction(template, fileParent) {
        var templateName = this.getTemplateName(template),
            render = this.env.render.bind(this.env, templateName)
        return render
    }

    setupTemplateNamespaces(template) {
        var leading = template.leading,
            fileParent = undefined
        setupNamespaces(this, template.leading)
        fileParent = leading.reduce((current, subDir) => current[subDir], this)
        Object.defineProperty(fileParent, template.name, {
            enumerable: true,
            writable: false,
            value: this.getQueryFunction(template, fileParent)
        })
    }

    getTemplateName(template) {
        // takes a template obj from the setupTemplateObject function
        // this really isnt supposed to be called directly
        return path.join(template.leading.join(path.sep), template.base)
    }
}
