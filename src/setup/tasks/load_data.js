var path = require('path'),
    fs = require('fs'),
    parse = require('csv-parse/lib/sync')

/*
  This will not work without bluejay and not without the loadCSV function
  from a sql template. It should look like the following


  INSERT INTO {{table}}({{ cols | columns }})
  VALUES
  {%- for row in rows %}
  {{row | values(cols) -}} {% if not loop.last %},{% endif %}
  {%- endfor %};


 */
module.exports = function loadDataFile(directory, environ='test') {
    var files = fs.readdirSync(directory)

    async function task() {
        var DB = this.DB,
            self = this,
            order = String(fs.readFileSync(path.join(directory, 'load_order'))).split('\n')

        if (this.verbose) console.log(`Loading files from ${directory} in order: ${order.join(', ')}`);
        files = files.filter(file => file != 'load_order')
        files.sort((a,b) => {
            return order.indexOf(a) - order.indexOf(b)
        }).forEach(file => {
            var text = fs.readFileSync(path.join(directory, file)),
                csv = parse(text, {
                    auto_parse: true,
                    skip_empty_lines: true,
                    columns: true
                })
            DB.loadCSV({
                table: path.parse(file).name,
                cols: Object.keys(csv[0]),
                rows: csv
            })
        })
        return await DB.results()
    }
    task.taskName = `loading datafiles at ${directory}`
    return task
}
