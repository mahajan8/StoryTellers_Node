var http = require("http");
// var fs = require('./filesystem')
var fs = require('fs');
var url = require('url');
var formidable = require('formidable');

let ht = 
`<html>
<body>
<h1>My Header</h1>
<p>My paragraph.</p>
</body>
</html>`

http.createServer(function (request, res) {
    // Send the HTTP header 
    // HTTP Status: 200 : OK
    // Content Type: text/plain

    if(request.url=='/fileupload') {
        var form = new formidable.IncomingForm();
        form.parse(request, function (err, fields, files) {
            var oldpath = files.filetoupload.path;
            var newpath = './images/' + files.filetoupload.name;
            fs.rename(oldpath, newpath, function (err) {
                if (err) throw err;
                res.write('File uploaded and moved!');
                res.end();
            });
        });
    } else {
        fs.readFile('test.html', function(err, data) {

            res.writeHead(200, {'Content-Type': 'text/html'});

            res.write(data)
            return res.end();
        })
    }
    // console.log(fs.filesystem())
    
 }).listen(8081);

console.log('Server running at http://127.0.0.1:8081/');