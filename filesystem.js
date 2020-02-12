
var fs = require('fs');

exports.filesystem = function () {
    fs.readFile('test.html', function(err, data) {
        // return data
        console.log(data)
        return data
    })
  };