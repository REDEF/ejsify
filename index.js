var ejs = require('ejs')
  , through = require('through')

module.exports = function(file, options) {
  if (!/\.ejs$/.test(file)) return through()

  options = options || {}

  var buffer = ""

  return through(function write(chunk) {
    buffer += chunk
  }, function end() {
    if (buffer.indexOf('module.exports') === 0) {
      this.queue(buffer); // prevent "double" transforms 
    } else {
      
      var template = ejs.compile(buffer, {
          client: true
        , compileDebug: options.debug || false
        , filename: file
      })
  
      this.queue('module.exports = (' + template + ')')
    }
    this.queue(null)
  })
}
